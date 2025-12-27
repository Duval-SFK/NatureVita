import { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQ = () => {
  const { language } = useContext(LanguageContext);
  const [openIndex, setOpenIndex] = useState(null);

  const translations = {
    fr: {
      title: 'Questions Fréquemment Posées',
      subtitle: 'Trouvez des réponses à vos questions sur nos produits et services',
      searchPlaceholder: 'Rechercher une question...',
      categories: {
        products: 'Produits',
        orders: 'Commandes',
        shipping: 'Livraison',
        returns: 'Retours'
      },
      contactText: 'Vous ne trouvez pas ce que vous cherchez ?',
      contactLink: 'Contactez-nous',
      faqs: [
        {
          category: 'products',
          question: 'Quels sont les ingrédients utilisés dans vos produits ?',
          answer: 'Tous nos produits sont fabriqués à partir d\'ingrédients 100% naturels, biologiques et durables. Nous n\'utilisons aucun produit chimique, conservateur artificiel ou additif nocif. Chaque produit a sa propre liste d\'ingrédients détaillée que vous pouvez consulter sur sa page spécifique.'
        },
        {
          category: 'products',
          question: 'Vos produits sont-ils testés sur les animaux ?',
          answer: 'Non, aucun de nos produits n\'est testé sur les animaux. Nous sommes fermement engagés dans une démarche éthique et respectueuse de toutes les formes de vie.'
        },
        {
          category: 'products',
          question: 'Quelle est la durée de conservation de vos produits ?',
          answer: 'La durée de conservation varie selon les produits, généralement entre 12 et 24 mois pour les produits non ouverts. Une fois ouverts, nous recommandons de les utiliser dans les 6 mois pour une efficacité optimale. La date de péremption est clairement indiquée sur chaque emballage.'
        },
        {
          category: 'orders',
          question: 'Comment puis-je passer une commande ?',
          answer: 'Vous pouvez passer une commande directement sur notre site web en ajoutant les produits à votre panier et en procédant au paiement. Vous pouvez également nous contacter par téléphone ou par email pour passer une commande personnalisée.'
        },
        {
          category: 'orders',
          question: 'Quels modes de paiement acceptez-vous ?',
          answer: 'Nous acceptons les paiements par carte bancaire, mobile money (Orange Money, MTN Mobile Money), et les virements bancaires pour les commandes importantes. Tous les paiements sont sécurisés.'
        },
        {
          category: 'shipping',
          question: 'Quels sont les délais de livraison ?',
          answer: 'Les délais de livraison varient selon votre localisation. Pour les livraisons à Abidjan, comptez 1 à 3 jours ouvrables. Pour les autres villes de Côte d\'Ivoire, comptez 3 à 5 jours ouvrables. Pour les livraisons internationales, les délais peuvent varier de 7 à 14 jours ouvrables.'
        },
        {
          category: 'shipping',
          question: 'Livrez-vous à l\'international ?',
          answer: 'Oui, nous livrons dans toute l\'Afrique de l\'Ouest et dans certains pays européens. Les frais de livraison et les délais varient selon la destination. Veuillez nous contacter pour plus d\'informations sur les livraisons internationales.'
        },
        {
          category: 'returns',
          question: 'Quelle est votre politique de retour ?',
          answer: 'Nous acceptons les retours dans les 14 jours suivant la réception de votre commande si les produits sont inutilisés et dans leur emballage d\'origine. Les frais de retour sont à la charge du client, sauf en cas d\'erreur de notre part ou de produit défectueux.'
        }
      ]
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to your questions about our products and services',
      searchPlaceholder: 'Search for a question...',
      categories: {
        products: 'Products',
        orders: 'Orders',
        shipping: 'Shipping',
        returns: 'Returns'
      },
      contactText: 'Can\'t find what you\'re looking for?',
      contactLink: 'Contact us',
      faqs: [
        {
          category: 'products',
          question: 'What ingredients are used in your products?',
          answer: 'All our products are made from 100% natural, organic, and sustainable ingredients. We do not use any chemicals, artificial preservatives, or harmful additives. Each product has its own detailed list of ingredients that you can view on its specific page.'
        },
        {
          category: 'products',
          question: 'Are your products tested on animals?',
          answer: 'No, none of our products are tested on animals. We are firmly committed to an ethical approach that respects all forms of life.'
        },
        {
          category: 'products',
          question: 'What is the shelf life of your products?',
          answer: 'The shelf life varies depending on the products, generally between 12 and 24 months for unopened products. Once opened, we recommend using them within 6 months for optimal effectiveness. The expiration date is clearly indicated on each package.'
        },
        {
          category: 'orders',
          question: 'How can I place an order?',
          answer: 'You can place an order directly on our website by adding products to your cart and proceeding to payment. You can also contact us by phone or email to place a custom order.'
        },
        {
          category: 'orders',
          question: 'What payment methods do you accept?',
          answer: 'We accept payments by credit card, mobile money (Orange Money, MTN Mobile Money), and bank transfers for large orders. All payments are secure.'
        },
        {
          category: 'shipping',
          question: 'What are the delivery times?',
          answer: 'Delivery times vary depending on your location. For deliveries to Abidjan, allow 1 to 3 business days. For other cities in Ivory Coast, allow 3 to 5 business days. For international deliveries, times may vary from 7 to 14 business days.'
        },
        {
          category: 'shipping',
          question: 'Do you deliver internationally?',
          answer: 'Yes, we deliver throughout West Africa and to certain European countries. Shipping costs and times vary depending on the destination. Please contact us for more information on international deliveries.'
        },
        {
          category: 'returns',
          question: 'What is your return policy?',
          answer: 'We accept returns within 14 days of receiving your order if the products are unused and in their original packaging. Return shipping costs are the responsibility of the customer, except in case of our error or defective product.'
        }
      ]
    }
  };

  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter FAQs based on active category and search query
  const filteredFaqs = t.faqs.filter(faq => {
    const matchesCategory = faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl opacity-90">{t.subtitle}</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full md:w-2/3 lg:w-1/2 mx-auto block px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {Object.entries(t.categories).map(([key, value]) => (
              <button
                key={key}
                className={`px-6 py-2 rounded-md ${activeCategory === key ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                onClick={() => setActiveCategory(key)}
              >
                {value}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-lg">{faq.question}</span>
                    {openIndex === index ? (
                      <FiMinus className="text-primary" />
                    ) : (
                      <FiPlus className="text-primary" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune question trouvée. Veuillez essayer une autre recherche.</p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-2">{t.contactText}</p>
            <a href="/contact" className="text-primary hover:underline font-medium">
              {t.contactLink}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;