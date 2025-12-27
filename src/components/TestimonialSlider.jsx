import { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const TestimonialSlider = () => {
  const { language } = useContext(LanguageContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sophie Dupont',
      location: language === 'fr' ? 'Douala, Cameroun' : 'Douala, Cameroon',
      rating: 5,
      text: language === 'fr'
        ? 'Jinja a complètement transformé ma santé ! Après seulement deux semaines d\'utilisation, j\'ai remarqué une amélioration significative de mon énergie et de mon bien-être général.'
        : 'Jinja has completely transformed my health! After just two weeks of use, I noticed a significant improvement in my energy and overall well-being.'
    },
    {
      id: 2,
      name: 'Jean Mbarga',
      location: language === 'fr' ? 'Yaoundé, Cameroun' : 'Yaoundé, Cameroon',
      rating: 5,
      text: language === 'fr'
        ? 'IRU Soap a fait des merveilles pour ma peau. Les problèmes d\'acné que j\'avais depuis des années ont disparu en quelques semaines. Je le recommande vivement !'
        : 'IRU Soap has done wonders for my skin. The acne problems I had for years disappeared in just a few weeks. I highly recommend it!'
    },
    {
      id: 3,
      name: 'Marie Nguema',
      location: language === 'fr' ? 'Libreville, Gabon' : 'Libreville, Gabon',
      rating: 4,
      text: language === 'fr'
        ? 'Le miel de NatureVita est le meilleur que j\'ai jamais goûté. Pur, naturel et délicieux. Je l\'utilise tous les jours dans mon thé et sur mes tartines.'
        : 'NatureVita honey is the best I have ever tasted. Pure, natural and delicious. I use it every day in my tea and on my toast.'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
        <div className="flex justify-center mb-6">
          {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
            <FiStar key={i} className="text-secondary w-6 h-6 fill-current" />
          ))}
          {Array.from({ length: 5 - testimonials[currentIndex].rating }).map((_, i) => (
            <FiStar key={i} className="text-gray-300 w-6 h-6" />
          ))}
        </div>
        
        <blockquote className="text-center">
          <p className="text-lg md:text-xl text-gray-700 italic mb-6">
            {testimonials[currentIndex].text}
          </p>
          <footer className="text-gray-600">
            <div className="font-bold text-primary">{testimonials[currentIndex].name}</div>
            <div className="text-sm">{testimonials[currentIndex].location}</div>
          </footer>
        </blockquote>
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
        aria-label="Previous testimonial"
      >
        <FiChevronLeft size={24} />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
        aria-label="Next testimonial"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;