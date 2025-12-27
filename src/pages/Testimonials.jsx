import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FiStar, FiUser } from 'react-icons/fi';

const Testimonials = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      title: 'Témoignages',
      subtitle: 'Ce que nos clients disent de nous',
      writeTestimonial: 'Partagez votre expérience',
      filter: {
        all: 'Tous',
        recent: 'Récents',
        highest: 'Mieux notés',
        lowest: 'Moins bien notés'
      },
      testimonialCount: 'témoignages',
      readMore: 'Lire plus',
      readLess: 'Lire moins',
      verified: 'Achat vérifié'
    },
    en: {
      title: 'Testimonials',
      subtitle: 'What our customers say about us',
      writeTestimonial: 'Share your experience',
      filter: {
        all: 'All',
        recent: 'Recent',
        highest: 'Highest rated',
        lowest: 'Lowest rated'
      },
      testimonialCount: 'testimonials',
      readMore: 'Read more',
      readLess: 'Read less',
      verified: 'Verified purchase'
    }
  };

  const t = translations[language];

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Nico Dev',
      date: '2023-10-15',
      rating: 5,
      product: 'Jinja',
      content: language === 'fr' 
        ? 'Depuis que j\'ai commencé à prendre Jinja, ma santé s\'est considérablement améliorée. J\'ai plus d\'énergie, je dors mieux et mes problèmes digestifs ont disparu. C\'est vraiment un produit miraculeux que je recommande à tous ceux qui cherchent à améliorer leur bien-être de façon naturelle.'
        : 'Since I started taking Jinja, my health has improved considerably. I have more energy, I sleep better, and my digestive problems have disappeared. It\'s truly a miraculous product that I recommend to anyone looking to improve their well-being naturally.',
      verified: true,
      avatar: null
    },
    {
      id: 2,
      name: 'Kouadio Yao',
      date: '2023-09-28',
      rating: 4,
      product: 'IRU Soap',
      content: language === 'fr'
        ? 'Le savon IRU a transformé ma peau. J\'avais des problèmes d\'acné depuis des années et après seulement deux semaines d\'utilisation, ma peau est devenue plus claire et les boutons ont considérablement diminué. Je retire une étoile car le parfum pourrait être amélioré, mais pour l\'efficacité, c\'est un 5/5.'
        : 'IRU soap has transformed my skin. I had been struggling with acne for years, and after just two weeks of use, my skin became clearer and the pimples significantly decreased. I\'m taking away one star because the fragrance could be improved, but for effectiveness, it\'s a 5/5.',
      verified: true,
      avatar: null
    },
    {
      id: 3,
      name: 'Sophie Mensah',
      date: '2023-11-02',
      rating: 5,
      product: 'Miel Naturel',
      content: language === 'fr'
        ? 'Ce miel est tout simplement délicieux ! Je l\'utilise dans mon thé chaque matin et il a un goût authentique qu\'on ne trouve pas dans les miels commerciaux. De plus, il m\'a aidé à soulager mes maux de gorge pendant la saison froide. Un produit de qualité exceptionnelle.'
        : 'This honey is simply delicious! I use it in my tea every morning, and it has an authentic taste that you don\'t find in commercial honey. Plus, it helped me relieve my sore throat during the cold season. A product of exceptional quality.',
      verified: true,
      avatar: null
    },
    {
      id: 4,
      name: 'Ibrahim Touré',
      date: '2023-08-17',
      rating: 3,
      product: 'IRU Shampoo',
      content: language === 'fr'
        ? 'Le shampooing IRU a des points positifs et négatifs. Il nettoie bien les cheveux et les laisse doux, mais je trouve qu\'il ne fait pas assez de mousse et l\'odeur est un peu trop forte à mon goût. Cependant, il a aidé à réduire mes pellicules, ce qui est un grand plus.'
        : 'IRU Shampoo has its pros and cons. It cleans hair well and leaves it soft, but I find it doesn\'t lather enough, and the smell is a bit too strong for my taste. However, it has helped reduce my dandruff, which is a big plus.',
      verified: true,
      avatar: null
    },
    {
      id: 5,
      name: 'Fatou Diallo',
      date: '2023-10-05',
      rating: 5,
      product: 'Jinja Plus',
      content: language === 'fr'
        ? 'Jinja Plus est encore meilleur que la version originale ! Les effets sont plus rapides et plus intenses. J\'ai remarqué une amélioration de ma circulation sanguine et une diminution de ma fatigue chronique. Le prix est un peu élevé, mais la qualité justifie l\'investissement. Je ne peux plus m\'en passer !'
        : 'Jinja Plus is even better than the original version! The effects are faster and more intense. I noticed an improvement in my blood circulation and a decrease in my chronic fatigue. The price is a bit high, but the quality justifies the investment. I can\'t do without it anymore!',
      verified: true,
      avatar: null
    },
    {
      id: 6,
      name: 'Jean-Marc ',
      date: '2023-11-10',
      rating: 4,
      product: 'Propolis',
      content: language === 'fr'
        ? 'La propolis de NatureVita est d\'une qualité remarquable. Je l\'utilise pour renforcer mon système immunitaire pendant les changements de saison et je tombe beaucoup moins malade qu\'avant. Le goût est assez fort, mais on s\'y habitue. Je recommande ce produit pour ses bienfaits sur la santé.'
        : 'NatureVita\'s propolis is of remarkable quality. I use it to strengthen my immune system during seasonal changes, and I get sick much less often than before. The taste is quite strong, but you get used to it. I recommend this product for its health benefits.',
      verified: false,
      avatar: null
    }
  ];

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar 
          key={i} 
          className={`${i <= rating ? 'text-secondary fill-current' : 'text-gray-300'} w-5 h-5`} 
        />
      );
    }
    return stars;
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

      {/* Testimonials Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Header with count and filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                <span className="font-bold text-primary">{testimonials.length}</span> {t.testimonialCount}
              </p>
            </div>
            
            <div className="flex space-x-2">
              {Object.entries(t.filter).map(([key, value]) => (
                <button 
                  key={key} 
                  className={`px-4 py-2 rounded-md ${key === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Write a testimonial button */}
          <div className="text-center mb-12">
            <button className="bg-secondary text-dark px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors inline-flex items-center">
              <FiUser className="mr-2" />
              {t.writeTestimonial}
            </button>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                      {testimonial.avatar ? (
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <FiUser className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(testimonial.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/5 px-3 py-1 rounded-full text-sm font-medium text-primary">
                    {testimonial.product}
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-gray-700 mb-4 flex-grow">{testimonial.content}</p>
                
                {testimonial.verified && (
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-sm text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t.verified}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;