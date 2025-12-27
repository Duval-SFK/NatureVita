import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

const About = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      title: 'À Propos de NatureVita',
      subtitle: 'Des produits naturels pour votre bien-être',
      story: 'Notre Histoire',
      storyContent: 'NatureVita est née d\'une passion pour les produits naturels et d\'un désir de partager les bienfaits de la nature avec le monde. Fondée en 2020, notre entreprise s\'est engagée à créer des produits de santé et de beauté de haute qualité, en utilisant uniquement des ingrédients naturels et biologiques.',
      mission: 'Notre Mission',
      missionContent: 'Notre mission est de fournir des produits naturels qui améliorent la santé et le bien-être de nos clients, tout en respectant l\'environnement. Nous croyons que la nature offre tout ce dont nous avons besoin pour vivre une vie saine et équilibrée.',
      values: 'Nos Valeurs',
      valuesItems: [
        'Qualité : Nous ne compromettons jamais la qualité de nos produits.',
        'Transparence : Nous sommes transparents sur nos ingrédients et nos processus.',
        'Durabilité : Nous nous engageons à minimiser notre impact environnemental.',
        'Innovation : Nous recherchons constamment de nouvelles façons d\'améliorer nos produits.'
      ],
      team: 'Notre Équipe',
      teamContent: 'Notre équipe est composée de passionnés qui partagent une vision commune : offrir le meilleur de la nature à nos clients. Chaque membre apporte son expertise et son dévouement pour créer des produits exceptionnels.',
      social: 'Suivez-nous',
      socialContent: 'Restez connecté avec nous sur les réseaux sociaux pour les dernières nouvelles, promotions et conseils de bien-être.'
    },
    en: {
      title: 'About NatureVita',
      subtitle: 'Natural products for your well-being',
      story: 'Our Story',
      storyContent: 'NatureVita was born from a passion for natural products and a desire to share the benefits of nature with the world. Founded in 2020, our company has committed to creating high-quality health and beauty products, using only natural and organic ingredients.',
      mission: 'Our Mission',
      missionContent: 'Our mission is to provide natural products that improve the health and well-being of our customers, while respecting the environment. We believe that nature offers everything we need to live a healthy and balanced life.',
      values: 'Our Values',
      valuesItems: [
        'Quality: We never compromise on the quality of our products.',
        'Transparency: We are transparent about our ingredients and processes.',
        'Sustainability: We are committed to minimizing our environmental impact.',
        'Innovation: We constantly research new ways to improve our products.'
      ],
      team: 'Our Team',
      teamContent: 'Our team consists of passionate individuals who share a common vision: to offer the best of nature to our customers. Each member brings their expertise and dedication to create exceptional products.',
      social: 'Follow Us',
      socialContent: 'Stay connected with us on social media for the latest news, promotions, and wellness tips.'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl opacity-90">{t.subtitle}</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-primary">{t.story}</h2>
            <p className="text-lg text-gray-700 mb-8">{t.storyContent}</p>
            
            <h2 className="text-3xl font-bold mb-6 text-primary">{t.mission}</h2>
            <p className="text-lg text-gray-700 mb-8">{t.missionContent}</p>
            
            <h2 className="text-3xl font-bold mb-6 text-primary">{t.values}</h2>
            <ul className="list-disc pl-6 text-lg text-gray-700 mb-8 space-y-2">
              {t.valuesItems.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-primary text-center">{t.team}</h2>
            <p className="text-lg text-gray-700 mb-12 text-center">{t.teamContent}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team members would go here - using placeholders for now */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-primary">John Doe</h3>
                  <p className="text-gray-500 mb-4">Fondateur & CEO</p>
                  <p className="text-gray-700">Passionné par les produits naturels et le bien-être.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-primary">Jane Smith</h3>
                  <p className="text-gray-500 mb-4">Directrice Produit</p>
                  <p className="text-gray-700">Experte en formulation de produits naturels.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-primary">David Johnson</h3>
                  <p className="text-gray-500 mb-4">Responsable Qualité</p>
                  <p className="text-gray-700">Veille à la qualité et à la sécurité de tous nos produits.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">{t.social}</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">{t.socialContent}</p>
          
          <div className="flex justify-center space-x-8">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors">
              <FaFacebook size={40} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors">
              <FaInstagram size={40} />
            </a>
            <a href="https://wa.me/+237678363871" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors">
              <FaWhatsapp size={40} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors">
              <FaTiktok size={40} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;