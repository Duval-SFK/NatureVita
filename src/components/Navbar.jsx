import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { language, changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const translations = {
    home: 'Accueil',
    products: 'Produits',
    about: 'À propos',
    testimonials: 'Témoignages',
    contact: 'Contact',
    login: 'Connexion',
    profile: 'Mon Profil',
    logout: 'Déconnexion',
    orderNow: 'Commander maintenant'
  };

  const { t, isLoading } = useTranslation(translations);

  return (
    <nav className="sticky top-0 z-50 text-white shadow-md bg-primary">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold md:text-2xl">NatureVita</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-6 md:flex">
            <Link to="/" className="transition-colors hover:text-secondary">
              {isLoading ? <span className="animate-pulse bg-gray-300 h-4 w-16 rounded"></span> : t.home}
            </Link>
            <Link to="/about" className="transition-colors hover:text-secondary">
              {isLoading ? <span className="animate-pulse bg-gray-300 h-4 w-16 rounded"></span> : t.about}
            </Link>
            <Link to="/products" className="transition-colors hover:text-secondary">
              {isLoading ? <span className="animate-pulse bg-gray-300 h-4 w-20 rounded"></span> : t.products}
            </Link>
            <Link to="/testimonials" className="transition-colors hover:text-secondary">
              {isLoading ? <span className="animate-pulse bg-gray-300 h-4 w-24 rounded"></span> : t.testimonials}
            </Link>
            <Link to="/contact" className="transition-colors hover:text-secondary">
              {isLoading ? <span className="animate-pulse bg-gray-300 h-4 w-16 rounded"></span> : t.contact}
            </Link>
          </div>

          {/* Right Side - Actions */}
          <div className="items-center hidden space-x-4 md:flex">
            {/* Language Selector */}
            <div className="relative group">
              <button className="p-2 transition-colors rounded-full hover:bg-primary-dark flex items-center space-x-1">
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 w-32 py-1 mt-1 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button 
                  onClick={() => changeLanguage('fr')}
                  className={`block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 ${language === 'fr' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  🇫🇷 Français
                </button>
                <button 
                  onClick={() => changeLanguage('en')}
                  className={`block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 ${language === 'en' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 transition-colors rounded-full hover:bg-primary-dark"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user && <NotificationBell />}

            <Link to="/products" className="px-4 py-2 transition-colors rounded-md bg-secondary text-dark hover:bg-opacity-90">
              {isLoading ? <span className="animate-pulse bg-gray-300 h-4 w-32 rounded"></span> : t.orderNow}
            </Link>

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center p-2 space-x-1 transition-colors rounded-full hover:bg-primary-dark"
                >
                  <FiUser size={20} />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 w-64 py-2 mt-2 bg-white rounded-md shadow-lg text-dark z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user?.name || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiUser className="mr-3" size={16} />
                        {t.profile}
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      >
                        <FiX className="mr-3" size={16} />
                        {t.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/profile" className="p-2 transition-colors rounded-full hover:bg-primary-dark">
                <FiUser size={20} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 transition-colors rounded-md hover:bg-primary-dark"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="pb-4 mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="transition-colors hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                {t.home}
              </Link>
              <Link to="/about" className="transition-colors hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                {t.about}
              </Link>
              <Link to="/products" className="transition-colors hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                {t.products}
              </Link>
              <Link to="/testimonials" className="transition-colors hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                {t.testimonials}
              </Link>
              <Link to="/contact" className="transition-colors hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                {t.contact}
              </Link>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <button 
                  onClick={() => {
                    changeLanguage(language === 'fr' ? 'en' : 'fr');
                    setIsMenuOpen(false);
                  }}
                  className="p-2 transition-colors rounded-full hover:bg-primary-dark"
                >
                  {language === 'fr' ? 'EN' : 'FR'}
                </button>
                
                <button 
                  onClick={() => {
                    toggleTheme();
                    setIsMenuOpen(false);
                  }}
                  className="p-2 transition-colors rounded-full hover:bg-primary-dark"
                >
                  {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>

                {user ? (
                  <>
                    <Link to="/profile" className="transition-colors hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                      {t.profile}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="transition-colors hover:text-secondary"
                    >
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <Link to="/profile" className="transition-colors hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                    {t.login}
                  </Link>
                )}
              </div>

              <Link 
                to="/products" 
                className="px-4 py-2 mt-2 text-center transition-colors rounded-md bg-secondary text-dark hover:bg-opacity-90"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.orderNow}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;