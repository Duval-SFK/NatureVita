// Service de traduction utilisant la base de données via l'API backend

import api from './api.js';

class TranslationService {
  constructor() {
    // Cache pour éviter les appels répétés
    this.cache = new Map();
    this.cacheExpiry = 60 * 60 * 1000; // 1 heure
  }

  /**
   * Get translations from API
   */
  async getTranslations(language = 'fr', context = null) {
    const cacheKey = `translations_${language}_${context || 'all'}`;
    const cached = this.cache.get(cacheKey);
    
    // Check cache
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await api.getTranslations(language, context);
      
      if (response.success && response.data.translations) {
        // Cache the result
        this.cache.set(cacheKey, {
          data: response.data.translations,
          timestamp: Date.now()
        });
        
        return response.data.translations;
      }
      
      return {};
    } catch (error) {
      console.error('Erreur lors de la récupération des traductions:', error);
      // Return empty object on error
      return {};
    }
  }

  /**
   * Get translation for a specific key
   */
  async getTranslation(key, language = 'fr', defaultValue = null) {
    const translations = await this.getTranslations(language);
    return translations[key] || defaultValue || key;
  }

  /**
   * Translate text using database translations
   * Falls back to original text if translation not found
   */
  async translateText(text, targetLanguage, sourceLanguage = 'fr') {
    // If same language, return original
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    // Try to get translation from database
    // First, try to find a translation key that matches the text
    const translations = await this.getTranslations(targetLanguage);
    
    // Look for exact match
    for (const [key, value] of Object.entries(translations)) {
      if (value === text || key === text) {
        return value;
      }
    }

    // If not found, return original text
    return text;
  }

  /**
   * Translate an object of translations
   */
  async translateObject(translations, targetLanguage, sourceLanguage = 'fr') {
    if (targetLanguage === sourceLanguage) {
      return translations;
    }

    const dbTranslations = await this.getTranslations(targetLanguage);
    const translatedObject = {};

    for (const [key, value] of Object.entries(translations)) {
      if (typeof value === 'string') {
        // First try database translation
        if (dbTranslations[key]) {
          translatedObject[key] = dbTranslations[key];
        } else {
          // Fallback to original
          translatedObject[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        translatedObject[key] = await this.translateObject(value, targetLanguage, sourceLanguage);
      } else {
        translatedObject[key] = value;
      }
    }

    return translatedObject;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Preload translations for a language
   */
  async preloadTranslations(language) {
    await this.getTranslations(language);
  }
}

// Instance singleton
const translationService = new TranslationService();
export default translationService;
