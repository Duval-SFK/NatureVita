import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const FeaturedProducts = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      viewDetails: 'Voir détails',
      orderNow: 'Commander',
      currency: 'FCFA'
    },
    en: {
      viewDetails: 'View details',
      orderNow: 'Order now',
      currency: 'FCFA'
    }
  };

  const t = translations[language];

  // Mock featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Jinja',
      description: language === 'fr' 
        ? 'Boisson naturelle à base de 70 plantes médicinales aux multiples bienfaits pour la santé.'
        : 'Natural drink made from 70 medicinal plants with multiple health benefits.',
      price: 15000,
      image: '/src/assets/images/product-placeholder.svg'
    },
    {
      id: 2,
      name: 'IRU Soap',
      description: language === 'fr'
        ? 'Savon naturel pour une peau éclatante et saine, fabriqué à partir d\'ingrédients biologiques.'
        : 'Natural soap for radiant and healthy skin, made from organic ingredients.',
      price: 5000,
      image: '/src/assets/images/product-placeholder.svg'
    },
    {
      id: 3,
      name: 'Miel Naturel',
      description: language === 'fr'
        ? 'Miel 100% naturel et pur, récolté dans des environnements préservés.'
        : '100% natural and pure honey, harvested in preserved environments.',
      price: 8000,
      image: '/src/assets/images/product-placeholder.svg'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProducts.map((product) => (
        <div 
          key={product.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              {product.name}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-primary">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary">
                {product.price.toLocaleString()} {t.currency}
              </span>
              <div className="space-x-2">
                <Link 
                  to={`/products/${product.id}`} 
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  {t.viewDetails}
                </Link>
                <Link 
                  to={`/products/${product.id}`} 
                  className="bg-secondary text-dark px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors inline-block ml-2"
                >
                  {t.orderNow}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;