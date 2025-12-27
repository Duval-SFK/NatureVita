import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const NotFound = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      title: 'Page non trouvée',
      message: 'Désolé, la page que vous recherchez n\'existe pas.',
      backHome: 'Retour à l\'accueil'
    },
    en: {
      title: 'Page not found',
      message: 'Sorry, the page you are looking for does not exist.',
      backHome: 'Back to home'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">{t.title}</h2>
        <p className="text-gray-600 mb-6">{t.message}</p>
        <Link 
          to="/" 
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all"
        >
          {t.backHome}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;