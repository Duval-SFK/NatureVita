import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      title: 'Politique de Confidentialité',
      subtitle: 'Comment nous protégeons vos données',
      lastUpdated: 'Dernière mise à jour : 1 Juin 2025',
      sections: [
        {
          title: 'Introduction',
          content: 'Chez NatureVita, nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web et nos services.'
        },
        {
          title: 'Informations que nous collectons',
          content: 'Nous pouvons collecter les informations suivantes : nom, adresse email, numéro de téléphone, adresse postale, informations de paiement et historique des commandes. Nous collectons également automatiquement certaines informations lorsque vous visitez notre site, comme votre adresse IP et les pages que vous consultez.'
        },
        {
          title: 'Utilisation de vos informations',
          content: 'Nous utilisons vos informations pour traiter vos commandes, gérer votre compte, vous envoyer des communications marketing (si vous y avez consenti), améliorer notre site web et nos produits, et respecter nos obligations légales.'
        },
        {
          title: 'Partage de vos informations',
          content: 'Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations avec des prestataires de services qui nous aident à exploiter notre site web et à livrer nos produits, mais uniquement dans la mesure nécessaire pour fournir ces services.'
        },
        {
          title: 'Sécurité des données',
          content: 'Nous avons mis en place des mesures de sécurité appropriées pour empêcher que vos informations personnelles ne soient accidentellement perdues, utilisées ou consultées de manière non autorisée, modifiées ou divulguées.'
        },
        {
          title: 'Cookies',
          content: 'Notre site web utilise des cookies pour améliorer votre expérience. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous avertir lorsqu\'un cookie est envoyé, mais certaines fonctionnalités de notre site peuvent ne pas fonctionner correctement sans cookies.'
        },
        {
          title: 'Vos droits',
          content: 'Vous avez le droit d\'accéder à vos informations personnelles, de les corriger, de les supprimer ou d\'en limiter le traitement. Vous avez également le droit de vous opposer au traitement et de demander la portabilité de vos données.'
        },
        {
          title: 'Modifications de cette politique',
          content: 'Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important par email ou par un avis sur notre site web.'
        },
        {
          title: 'Nous contacter',
          content: 'Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à privacy@naturevita.ci ou par courrier à notre adresse postale.'
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      lastUpdated: 'Last updated: June 1, 2025',
      sections: [
        {
          title: 'Introduction',
          content: 'At NatureVita, we are committed to protecting your privacy. This privacy policy explains how we collect, use, and protect your personal information when you use our website and services.'
        },
        {
          title: 'Information We Collect',
          content: 'We may collect the following information: name, email address, phone number, postal address, payment information, and order history. We also automatically collect certain information when you visit our site, such as your IP address and the pages you view.'
        },
        {
          title: 'How We Use Your Information',
          content: 'We use your information to process your orders, manage your account, send you marketing communications (if you have consented), improve our website and products, and comply with our legal obligations.'
        },
        {
          title: 'Sharing Your Information',
          content: 'We do not sell your personal information to third parties. We may share your information with service providers who help us operate our website and deliver our products, but only to the extent necessary to provide these services.'
        },
        {
          title: 'Data Security',
          content: 'We have put in place appropriate security measures to prevent your personal information from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.'
        },
        {
          title: 'Cookies',
          content: 'Our website uses cookies to enhance your experience. You can set your browser to refuse all cookies or to alert you when a cookie is being sent, but some parts of our site may not function properly without cookies.'
        },
        {
          title: 'Your Rights',
          content: 'You have the right to access your personal information, correct it, delete it, or limit its processing. You also have the right to object to processing and request the portability of your data.'
        },
        {
          title: 'Changes to This Policy',
          content: 'We may update this privacy policy from time to time. We will notify you of any significant changes by email or through a notice on our website.'
        },
        {
          title: 'Contact Us',
          content: 'If you have any questions about this privacy policy, please contact us at privacy@naturevita.ci or by mail at our postal address.'
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

export default PrivacyPolicy;