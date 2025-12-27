import { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiStar } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const translations = {
    fr: {
      backToProducts: 'Retour aux produits',
      addToCart: 'Ajouter au panier',
      addToWishlist: 'Ajouter aux favoris',
      share: 'Partager',
      quantity: 'Quantité',
      inStock: 'En stock',
      outOfStock: 'Rupture de stock',
      tabs: {
        description: 'Description',
        ingredients: 'Ingrédients',
        usage: 'Utilisation',
        reviews: 'Avis'
      },
      relatedProducts: 'Produits similaires',
      viewProduct: 'Voir le produit',
      currency: 'FCFA',
      reviews: {
        title: 'Avis clients',
        writeReview: 'Écrire un avis',
        basedOn: 'Basé sur',
        verified: 'Achat vérifié',
        helpful: 'Utile ?',
        reportAbuse: 'Signaler un abus'
      }
    },
    en: {
      backToProducts: 'Back to products',
      addToCart: 'Add to cart',
      addToWishlist: 'Add to wishlist',
      share: 'Share',
      quantity: 'Quantity',
      inStock: 'In stock',
      outOfStock: 'Out of stock',
      tabs: {
        description: 'Description',
        ingredients: 'Ingredients',
        usage: 'Usage',
        reviews: 'Reviews'
      },
      relatedProducts: 'Related products',
      viewProduct: 'View product',
      currency: 'FCFA',
      reviews: {
        title: 'Customer reviews',
        writeReview: 'Write a review',
        basedOn: 'Based on',
        verified: 'Verified purchase',
        helpful: 'Helpful?',
        reportAbuse: 'Report abuse'
      }
    }
  };

  const t = translations[language];

  // Mock product data - in a real app, this would come from an API
  const products = [
    {
      id: '1',
      name: 'Jinja',
      price: 15000,
      stock: 50,
      rating: 4.8,
      reviewCount: 124,
      image: '/src/assets/images/product-placeholder.svg',
      description: language === 'fr' 
        ? 'Jinja est une boisson naturelle à base de 70 plantes médicinales soigneusement sélectionnées. Cette formule unique est le résultat de recherches approfondies sur les remèdes traditionnels africains, combinées avec des méthodes modernes d\'extraction pour maximiser les bienfaits. Jinja aide à renforcer le système immunitaire, améliore la digestion, et procure une énergie naturelle tout au long de la journée.'
        : 'Jinja is a natural drink made from 70 carefully selected medicinal plants. This unique formula is the result of extensive research on traditional African remedies, combined with modern extraction methods to maximize benefits. Jinja helps strengthen the immune system, improves digestion, and provides natural energy throughout the day.',
      ingredients: language === 'fr'
        ? 'Gingembre, citronnelle, menthe, hibiscus, moringa, baobab, curcuma, cannelle, clou de girofle, cardamome, et 60 autres plantes médicinales. Aucun conservateur artificiel, colorant ou édulcorant ajouté.'
        : 'Ginger, lemongrass, mint, hibiscus, moringa, baobab, turmeric, cinnamon, clove, cardamom, and 60 other medicinal plants. No artificial preservatives, colors, or sweeteners added.',
      usage: language === 'fr'
        ? 'Boire 50ml de Jinja dilué dans un verre d\'eau, une à deux fois par jour. Peut être consommé chaud ou froid. Pour de meilleurs résultats, prendre régulièrement pendant au moins 3 semaines. Conserver au réfrigérateur après ouverture et consommer dans les 2 semaines.'
        : 'Drink 50ml of Jinja diluted in a glass of water, once or twice a day. Can be consumed hot or cold. For best results, take regularly for at least 3 weeks. Store in the refrigerator after opening and consume within 2 weeks.',
      reviews: [
        {
          id: 1,
          name: 'Aminata K.',
          date: '2023-10-15',
          rating: 5,
          content: language === 'fr' 
            ? 'Excellent produit ! Je me sens beaucoup plus énergique depuis que je le prends chaque matin.'
            : 'Excellent product! I feel much more energetic since I started taking it every morning.',
          verified: true
        },
        {
          id: 2,
          name: 'Ibrahim T.',
          date: '2023-09-28',
          rating: 4,
          content: language === 'fr'
            ? 'Très bon goût et des effets positifs sur ma digestion. Je retire une étoile car le prix est un peu élevé.'
            : 'Very good taste and positive effects on my digestion. I\'m taking away one star because the price is a bit high.',
          verified: true
        }
      ]
    },
    {
      id: '2',
      name: 'IRU Soap',
      price: 5000,
      stock: 75,
      rating: 4.5,
      reviewCount: 89,
      image: '/src/assets/images/product-placeholder.svg',
      description: language === 'fr'
        ? 'Le savon IRU est un savon naturel fabriqué à partir d\'ingrédients biologiques de haute qualité. Sa formule unique combine des huiles essentielles et des extraits de plantes africaines connues pour leurs propriétés purifiantes et nourrissantes. Ce savon convient à tous les types de peau et est particulièrement efficace pour traiter l\'acné, l\'eczéma et autres problèmes cutanés.'
        : 'IRU Soap is a natural soap made from high-quality organic ingredients. Its unique formula combines essential oils and extracts from African plants known for their purifying and nourishing properties. This soap is suitable for all skin types and is particularly effective in treating acne, eczema, and other skin problems.',
      ingredients: language === 'fr'
        ? 'Huile de palme biologique, huile de coco, beurre de karité, huile d\'olive, huile essentielle de tea tree, extrait de neem, extrait d\'aloe vera, argile verte, charbon actif.'
        : 'Organic palm oil, coconut oil, shea butter, olive oil, tea tree essential oil, neem extract, aloe vera extract, green clay, activated charcoal.',
      usage: language === 'fr'
        ? 'Mouiller le savon et frotter entre les mains pour créer une mousse riche. Appliquer sur le visage ou le corps en massant doucement. Rincer abondamment à l\'eau tiède. Utiliser matin et soir pour de meilleurs résultats.'
        : 'Wet the soap and rub between hands to create a rich lather. Apply to face or body with gentle massage. Rinse thoroughly with lukewarm water. Use morning and evening for best results.',
      reviews: [
        {
          id: 1,
          name: 'Sophie M.',
          date: '2023-11-02',
          rating: 5,
          content: language === 'fr' 
            ? 'Ce savon a complètement transformé ma peau ! Plus d\'acné et ma peau est maintenant hydratée et éclatante.'
            : 'This soap has completely transformed my skin! No more acne and my skin is now hydrated and radiant.',
          verified: true
        },
        {
          id: 2,
          name: 'Kouadio Y.',
          date: '2023-08-17',
          rating: 4,
          content: language === 'fr'
            ? 'Très bon savon, mais l\'odeur pourrait être améliorée. Efficace contre les problèmes de peau.'
            : 'Very good soap, but the smell could be improved. Effective against skin problems.',
          verified: true
        }
      ]
    }
  ];

  // Find the current product based on the ID from URL params
  const product = products.find(p => p.id === id) || products[0];

  // Related products (excluding current product)
  const relatedProducts = products.filter(p => p.id !== id);

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

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <Link to="/products" className="text-primary hover:text-primary-dark flex items-center">
            <FiChevronLeft className="mr-1" />
            {t.backToProducts}
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                  {product.name}
                </div>
              </div>
              
              {/* Thumbnails - would be actual images in a real app */}
              <div className="flex mt-4 space-x-4 justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-md cursor-pointer"></div>
                <div className="w-16 h-16 bg-gray-100 rounded-md cursor-pointer"></div>
                <div className="w-16 h-16 bg-gray-100 rounded-md cursor-pointer"></div>
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600">
                  ({product.rating}) - {product.reviewCount} {language === 'fr' ? 'avis' : 'reviews'}
                </span>
              </div>
              
              <div className="text-2xl font-bold text-primary mb-6">
                {product.price.toLocaleString()} {t.currency}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  {product.description.substring(0, 150)}...
                </p>
              </div>
              
              <div className="mb-6">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? t.inStock : t.outOfStock}
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">{t.quantity}</label>
                <div className="flex">
                  <button 
                    onClick={decrementQuantity}
                    className="bg-gray-200 px-4 py-2 rounded-l-md hover:bg-gray-300 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center border-t border-b border-gray-300 py-2"
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="bg-gray-200 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors flex items-center">
                  <FiShoppingCart className="mr-2" />
                  {t.addToCart}
                </button>
                <button className="bg-white text-primary border border-primary px-6 py-3 rounded-md hover:bg-primary/5 transition-colors flex items-center">
                  <FiHeart className="mr-2" />
                  {t.addToWishlist}
                </button>
                <button className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                  <FiShare2 className="mr-2" />
                  {t.share}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex flex-wrap -mb-px">
              {Object.entries(t.tabs).map(([key, value]) => (
                <button
                  key={key}
                  className={`inline-block py-4 px-6 border-b-2 font-medium text-sm ${activeTab === key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab(key)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="max-w-3xl mx-auto">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}
            
            {activeTab === 'ingredients' && (
              <div>
                <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
              </div>
            )}
            
            {activeTab === 'usage' && (
              <div>
                <p className="text-gray-700 leading-relaxed">{product.usage}</p>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900">{t.reviews.title}</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                    {t.reviews.writeReview}
                  </button>
                </div>
                
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center flex-col">
                    <div className="text-5xl font-bold text-primary mb-2">{product.rating}</div>
                    <div className="flex mb-2">
                      {renderStars(product.rating)}
                    </div>
                    <p className="text-gray-600">
                      {t.reviews.basedOn} {product.reviewCount} {language === 'fr' ? 'avis' : 'reviews'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {product.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between mb-2">
                        <div>
                          <span className="font-bold text-gray-900">{review.name}</span>
                          <span className="text-gray-500 ml-2">
                            {new Date(review.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                          </span>
                        </div>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.content}</p>
                      
                      <div className="flex justify-between items-center">
                        {review.verified && (
                          <div className="text-green-600 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t.reviews.verified}
                          </div>
                        )}
                        
                        <div className="flex space-x-4 text-sm">
                          <button className="text-gray-500 hover:text-gray-700">
                            {t.reviews.helpful}
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            {t.reviews.reportAbuse}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.relatedProducts}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {relatedProduct.name}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{relatedProduct.name}</h3>
                    <div className="flex mb-2">
                      {renderStars(relatedProduct.rating)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">
                        {relatedProduct.price.toLocaleString()} {t.currency}
                      </span>
                      <Link 
                        to={`/products/${relatedProduct.id}`} 
                        className="text-primary hover:text-primary-dark"
                      >
                        {t.viewProduct}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;