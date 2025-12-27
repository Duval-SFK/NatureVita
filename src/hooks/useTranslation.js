import { useState, useEffect, useContext, useMemo } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translationService from '../services/translationService';

/**
 * Hook personnalisé pour les traductions basées sur la base de données
 * @param {Object} translations - Traductions par défaut (français)
 * @param {string} context - Contexte des traductions (optionnel)
 */
export const useTranslation = (translations = {}, context = null) => {
  const { language } = useContext(LanguageContext);
  const [translatedContent, setTranslatedContent] = useState(translations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dbTranslations, setDbTranslations] = useState({});
  
  // Mémoriser les traductions pour éviter les re-renders inutiles
  const memoizedTranslations = useMemo(() => translations, [translations]);

  // Charger les traductions de la base de données
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const translations = await translationService.getTranslations(language, context);
        setDbTranslations(translations);
      } catch (err) {
        console.error('Error loading translations:', err);
        setError(err.message);
        setDbTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language, context]);

  // Merger les traductions de la DB avec les traductions par défaut
  useEffect(() => {
    if (language === 'fr') {
      // Pour le français, utiliser les traductions par défaut
      setTranslatedContent(memoizedTranslations);
      return;
    }

    // Pour les autres langues, merger DB translations avec defaults
    const merged = { ...memoizedTranslations };
    
    // Remplacer par les traductions de la DB si disponibles
    Object.keys(memoizedTranslations).forEach(key => {
      if (dbTranslations[key]) {
        merged[key] = dbTranslations[key];
      }
    });

    setTranslatedContent(merged);
  }, [language, memoizedTranslations, dbTranslations]);

  return {
    t: translatedContent,
    isLoading,
    error,
    language
  };
};

// Hook pour traduire un texte simple
export const useTextTranslation = (text, sourceLanguage = 'fr') => {
  const { language } = useContext(LanguageContext);
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const translateText = async () => {
      if (language === sourceLanguage) {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const translated = await translationService.translateText(
          text,
          language,
          sourceLanguage
        );
        setTranslatedText(translated);
      } catch (err) {
        setError(err.message);
        setTranslatedText(text); // Texte original en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };

    if (text) {
      translateText();
    }
  }, [text, language, sourceLanguage]);

  return {
    translatedText,
    isLoading,
    error
  };
};