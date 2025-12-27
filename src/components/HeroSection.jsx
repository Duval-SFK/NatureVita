import { Link } from 'react-router-dom';

const HeroSection = ({ title, subtitle, ctaText, ctaLink }) => {
  return (
    <section className="relative bg-primary text-white py-20 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 opacity-10 bg-[url('/src/assets/images/pattern.svg')] bg-repeat"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {subtitle}
            </p>
            <Link 
              to={ctaLink} 
              className="inline-block bg-secondary text-dark px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              {ctaText}
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              {/* Placeholder for hero image */}
              <div className="w-80 h-80 md:w-96 md:h-96 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-lg opacity-70">Image du produit</span>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary rounded-full opacity-70"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;