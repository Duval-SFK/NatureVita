import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const TermsConditions = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      title: 'Conditions Générales',
      subtitle: 'Veuillez lire attentivement ces conditions',
      lastUpdated: 'Dernière mise à jour : 1 Juin 2025',
      sections: [
        {
          title: 'Introduction',
          content: 'Bienvenue sur NatureVita. En accédant à notre site web et en utilisant nos services, vous acceptez d\'être lié par ces conditions générales. Si vous n\'êtes pas d\'accord avec une partie de ces conditions, veuillez ne pas utiliser notre site web.'
        },
        {
          title: 'Utilisation du Site',
          content: 'Le contenu de notre site web est fourni à titre informatif uniquement. Nous nous réservons le droit de modifier, suspendre ou interrompre tout aspect du site à tout moment sans préavis.'
        },
        {
          title: 'Propriété Intellectuelle',
          content: 'Tout le contenu présent sur ce site, y compris les textes, graphiques, logos, images et logiciels, est la propriété de NatureVita et est protégé par les lois sur la propriété intellectuelle.'
        },
        {
          title: 'Commandes et Paiements',
          content: 'En passant une commande sur notre site, vous garantissez que vous êtes légalement capable de conclure des contrats contraignants. Les paiements sont traités de manière sécurisée et nous ne stockons pas vos informations de carte de crédit.'
        },
        {
          title: 'Livraison',
          content: 'Nous nous efforçons de livrer vos produits dans les délais indiqués. Cependant, des retards peuvent survenir en raison de circonstances imprévues. Nous ne sommes pas responsables des retards causés par des événements indépendants de notre volonté.'
        },
        {
          title: 'Retours et Remboursements',
          content: 'Vous pouvez retourner un produit dans les 14 jours suivant sa réception si celui-ci est inutilisé et dans son emballage d\'origine. Les frais de retour sont à votre charge, sauf en cas d\'erreur de notre part ou de produit défectueux.'
        },
        {
          title: 'Limitation de Responsabilité',
          content: 'NatureVita ne sera pas responsable des dommages indirects, spéciaux ou consécutifs résultant de l\'utilisation ou de l\'impossibilité d\'utiliser nos produits ou services.'
        },
        {
          title: 'Loi Applicable',
          content: 'Ces conditions sont régies par les lois de la Côte d\'Ivoire. Tout litige découlant de ces conditions sera soumis à la juridiction exclusive des tribunaux d\'Abidjan.'
        }
      ]
    },
    en: {
      title: 'Terms and Conditions',
      subtitle: 'Please read these terms carefully',
      lastUpdated: 'Last updated: June 1, 2025',
      sections: [
        {
          title: 'Introduction',
          content: 'Welcome to NatureVita. By accessing our website and using our services, you agree to be bound by these terms and conditions. If you disagree with any part of these terms, please do not use our website.'
        },
        {
          title: 'Use of Site',
          content: 'The content of our website is provided for informational purposes only. We reserve the right to modify, suspend, or discontinue any aspect of the site at any time without notice.'
        },
        {
          title: 'Intellectual Property',
          content: 'All content on this site, including text, graphics, logos, images, and software, is the property of NatureVita and is protected by intellectual property laws.'
        },
        {
          title: 'Orders and Payments',
          content: 'By placing an order on our site, you warrant that you are legally capable of entering into binding contracts. Payments are processed securely, and we do not store your credit card information.'
        },
        {
          title: 'Delivery',
          content: 'We strive to deliver your products within the timeframes indicated. However, delays may occur due to unforeseen circumstances. We are not responsible for delays caused by events beyond our control.'
        },
        {
          title: 'Returns and Refunds',
          content: 'You may return a product within 14 days of receipt if it is unused and in its original packaging. Return shipping costs are your responsibility, except in case of our error or defective product.'
        },
        {
          title: 'Limitation of Liability',
          content: 'NatureVita will not be liable for any indirect, special, or consequential damages arising from the use or inability to use our products or services.'
        },
        {
          title: 'Governing Law',
          content: 'These terms are governed by the laws of Ivory Coast. Any dispute arising from these terms will be subject to the exclusive jurisdiction of the courts of Abidjan.'
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-4 text-center">{t.title}</h1>
          <p className="text-xl text-gray-600 mb-8 text-center">{t.subtitle}</p>
          <p className="text-sm text-gray-500 mb-10 text-center">{t.lastUpdated}</p>

          <div className="bg-white rounded-lg shadow-md p-8">
            {t.sections.map((section, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h2 className="text-2xl font-semibold text-primary mb-4">{section.title}</h2>
                <p className="text-gray-700">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;