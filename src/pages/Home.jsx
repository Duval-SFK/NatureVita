import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import TestimonialSlider from '../components/TestimonialSlider';
import BenefitsSection from '../components/BenefitsSection';
import CallToAction from '../components/CallToAction';

const Home = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      title: 'Bienvenue chez NatureVita',
      subtitle: 'Des produits naturels pour votre santé et beauté',
      viewProducts: 'Voir nos produits',
      featuredTitle: 'Nos produits phares',
      testimonialTitle: 'Ce que disent nos clients',
      benefitsTitle: 'Pourquoi choisir NatureVita ?',
      ctaTitle: 'Prêt à transformer votre santé ?',
      ctaButton: 'Commander maintenant'
    },
    en: {
      title: 'Welcome to NatureVita',
      subtitle: 'Natural products for your health and beauty',
      viewProducts: 'View our products',
      featuredTitle: 'Our featured products',
      testimonialTitle: 'What our customers say',
      benefitsTitle: 'Why choose NatureVita?',
      ctaTitle: 'Ready to transform your health?',
      ctaButton: 'Order now'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen">
      <HeroSection 
        title={t.title}
        subtitle={t.subtitle}
        ctaText={t.viewProducts}
        ctaLink="/products"
      />
      
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {t.featuredTitle}
          </h2>
          <FeaturedProducts />
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {t.testimonialTitle}
          </h2>
          <TestimonialSlider />
        </div>
      </section>

      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {t.benefitsTitle}
          </h2>
          <BenefitsSection />
        </div>
      </section>

      <CallToAction 
        title={t.ctaTitle}
        buttonText={t.ctaButton}
        buttonLink="/products"
      />
    </div>
  );
};

export default Home;