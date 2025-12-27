import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FiCheck, FiAward, FiHeart, FiShield } from 'react-icons/fi';

const BenefitsSection = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      benefits: [
        {
          icon: <FiCheck className="w-10 h-10 text-primary" />,
          title: '100% Naturel',
          description: 'Tous nos produits sont fabriqués à partir d\'ingrédients naturels, sans produits chimiques nocifs.'
        },
        {
          icon: <FiAward className="w-10 h-10 text-primary" />,
          title: 'Qualité Premium',
          description: 'Nous sélectionnons uniquement les meilleurs ingrédients pour garantir des produits de haute qualité.'
        },
        {
          icon: <FiHeart className="w-10 h-10 text-primary" />,
          title: 'Bienfaits pour la Santé',
          description: 'Nos produits sont conçus pour améliorer votre santé et votre bien-être de manière holistique.'
        },
        {
          icon: <FiShield className="w-10 h-10 text-primary" />,
          title: 'Satisfaction Garantie',
          description: 'Nous sommes confiants dans la qualité de nos produits et offrons une garantie de satisfaction.'
        }
      ]
    },
    en: {
      benefits: [
        {
          icon: <FiCheck className="w-10 h-10 text-primary" />,
          title: '100% Natural',
          description: 'All our products are made from natural ingredients, without harmful chemicals.'
        },
        {
          icon: <FiAward className="w-10 h-10 text-primary" />,
          title: 'Premium Quality',
          description: 'We select only the best ingredients to ensure high-quality products.'
        },
        {
          icon: <FiHeart className="w-10 h-10 text-primary" />,
          title: 'Health Benefits',
          description: 'Our products are designed to improve your health and well-being in a holistic way.'
        },
        {
          icon: <FiShield className="w-10 h-10 text-primary" />,
          title: 'Satisfaction Guaranteed',
          description: 'We are confident in the quality of our products and offer a satisfaction guarantee.'
        }
      ]
    }
  };

  const benefits = translations[language].benefits;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {benefits.map((benefit, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start">
            <div className="mr-4 p-2 bg-primary/10 rounded-full">
              {benefit.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-primary">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BenefitsSection;