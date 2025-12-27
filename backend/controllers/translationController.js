import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get translations by language
 */
export const getTranslations = asyncHandler(async (req, res) => {
  const { language = 'fr', context } = req.query;

  let query = 'SELECT `key`, `value`, `context` FROM translations WHERE language = ?';
  const params = [language];

  if (context) {
    query += ' AND context = ?';
    params.push(context);
  }

  const [translations] = await pool.execute(query, params);

  // Convert to object format { key: value }
  const translationsObj = {};
  translations.forEach(t => {
    translationsObj[t.key] = t.value;
  });

  res.json({
    success: true,
    data: {
      language,
      translations: translationsObj
    }
  });
});

/**
 * Get all translations (admin only)
 */
export const getAllTranslations = asyncHandler(async (req, res) => {
  const { language, context } = req.query;

  let query = 'SELECT * FROM translations WHERE 1=1';
  const params = [];

  if (language) {
    query += ' AND language = ?';
    params.push(language);
  }

  if (context) {
    query += ' AND context = ?';
    params.push(context);
  }

  query += ' ORDER BY language, `key`';

  const [translations] = await pool.execute(query, params);

  res.json({
    success: true,
    data: { translations }
  });
});

/**
 * Create or update translation (admin only)
 */
export const upsertTranslation = asyncHandler(async (req, res) => {
  const { key, language, value, context } = req.body;

  if (!key || !language || !value) {
    return res.status(400).json({
      success: false,
      message: 'Key, language, and value are required'
    });
  }

  // Check if translation exists
  const [existing] = await pool.execute(
    'SELECT id FROM translations WHERE `key` = ? AND language = ?',
    [key, language]
  );

  if (existing.length > 0) {
    // Update
    await pool.execute(
      'UPDATE translations SET `value` = ?, context = ?, updatedAt = NOW() WHERE id = ?',
      [value, context || null, existing[0].id]
    );

    res.json({
      success: true,
      message: 'Translation updated successfully'
    });
  } else {
    // Create
    const [result] = await pool.execute(
      'INSERT INTO translations (`key`, language, `value`, context) VALUES (?, ?, ?, ?)',
      [key, language, value, context || null]
    );

    res.status(201).json({
      success: true,
      message: 'Translation created successfully',
      data: { id: result.insertId }
    });
  }
});

/**
 * Delete translation (admin only)
 */
export const deleteTranslation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await pool.execute('DELETE FROM translations WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Translation deleted successfully'
  });
});

/**
 * Bulk import translations (admin only)
 */
export const bulkImportTranslations = asyncHandler(async (req, res) => {
  const { translations } = req.body;

  if (!Array.isArray(translations) || translations.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Translations array is required'
    });
  }

  const values = translations.map(t => [
    t.key,
    t.language,
    t.value,
    t.context || null
  ]);

  // Use INSERT ... ON DUPLICATE KEY UPDATE
  const query = `
    INSERT INTO translations (\`key\`, language, \`value\`, context)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      \`value\` = VALUES(\`value\`),
      context = VALUES(context),
      updatedAt = NOW()
  `;

  await pool.query(query, [values]);

  res.json({
    success: true,
    message: `${translations.length} translations imported successfully`
  });
});

