import React, { useState, useEffect, useRef } from 'react';
import { FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

const TranslationStatus = ({ isLoading, error, language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isLoading || error) {
      setIsVisible(true);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Auto-hide after 3 seconds if not loading
      if (!isLoading) {
        const id = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
        timeoutRef.current = id;
      }
    } else {
      // Show success briefly
      setIsVisible(true);
      const id = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      timeoutRef.current = id;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, error]);

  if (!isVisible) return null;

  const getStatusConfig = () => {
    if (isLoading) {
      return {
        icon: <FiLoader className="animate-spin" size={16} />,
        message: `Traduction en cours vers ${getLanguageName(language)}...`,
        bgColor: 'bg-blue-500',
        textColor: 'text-white'
      };
    }
    
    if (error) {
      return {
        icon: <FiAlertCircle size={16} />,
        message: 'Erreur de traduction - Texte original affiché',
        bgColor: 'bg-red-500',
        textColor: 'text-white'
      };
    }
    
    return {
      icon: <FiCheck size={16} />,
      message: `Traduit en ${getLanguageName(language)}`,
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    };
  };

  const getLanguageName = (lang) => {
    const languageNames = {
      'fr': 'Français',
      'en': 'Anglais',
    };
    return languageNames[lang] || lang.toUpperCase();
  };

  const config = getStatusConfig();

  return (
    <div className={`fixed top-20 right-4 z-50 ${config.bgColor} ${config.textColor} px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      {config.icon}
      <span className="text-sm font-medium">{config.message}</span>
      <button 
        onClick={() => setIsVisible(false)}
        className="ml-2 hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default TranslationStatus;