import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { LanguageContext } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    fr: {
      about: 'À propos',
      products: 'Produits',
      testimonials: 'Témoignages',
      faq: 'FAQ',
      contact: 'Contact',
      terms: 'Conditions générales',
      privacy: 'Politique de confidentialité',
      followUs: 'Suivez-nous',
      newsletter: 'Newsletter',
      subscribeText: 'Inscrivez-vous pour recevoir nos dernières actualités',
      subscribe: 'S\'inscrire',
      emailPlaceholder: 'Votre email',
      copyright: '© 2025 NatureVita. Tous droits réservés.'
    },
    en: {
      about: 'About',
      products: 'Products',
      testimonials: 'Testimonials',
      faq: 'FAQ',
      contact: 'Contact',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      subscribeText: 'Subscribe to receive our latest news',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Your email',
      copyright: '© 2025 NatureVita. All rights reserved.'
    }
  };

  const t = translations[language];

  return (
    <footer className="pt-10 pb-6 text-white bg-primary">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="text-2xl font-bold">NatureVita</Link>
            <p className="mt-4 text-sm opacity-80">
              NatureVita vous propose des produits naturels de santé et beauté, fabriqués avec des ingrédients de qualité supérieure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t.about}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm transition-opacity opacity-80 hover:opacity-100">
                  {t.about}
                </Link>
              </li>
              
              <li>
                <Link to="/products" className="text-sm transition-opacity opacity-80 hover:opacity-100">
                  {t.products}
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-sm transition-opacity opacity-80 hover:opacity-100">
                  {t.testimonials}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm transition-opacity opacity-80 hover:opacity-100">
                  {t.faq}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm transition-opacity opacity-80 hover:opacity-100">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm transition-opacity opacity-80 hover:opacity-100">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm transition-opacity opacity-80 hover:opacity-100">
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social and Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t.followUs}</h3>
            <div className="flex mb-6 space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-secondary">
                <FaFacebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-secondary">
                <FaInstagram size={24} />
              </a>
              <a href="https://wa.me/+237678363871" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-secondary">
                <FaWhatsapp size={24} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-secondary">
                <FaTiktok size={24} />
              </a>
            </div>

            <h3 className="mb-2 text-lg font-semibold">{t.newsletter}</h3>
            <p className="mb-2 text-sm opacity-80">{t.subscribeText}</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder={t.emailPlaceholder} 
                className="w-full px-3 py-2 rounded-l-md text-dark focus:outline-none"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 transition-colors bg-secondary text-dark rounded-r-md hover:bg-opacity-90"
              >
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 mt-8 text-sm text-center border-t border-white/10 opacity-70">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;