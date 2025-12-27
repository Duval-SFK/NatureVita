import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ title, description, keywords, image, type = 'website' }) => {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
  const currentUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title ? `${title} | NatureVita` : 'NatureVita - Produits Naturels';

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description || 'NatureVita - Votre destination pour des produits naturels de qualité. Plantes médicinales, compléments naturels, huiles essentielles et cosmétiques naturels.');
    updateMetaTag('keywords', keywords || 'produits naturels, plantes médicinales, compléments naturels, huiles essentielles, cosmétiques naturels, santé naturelle');
    
    // Open Graph tags
    updateMetaTag('og:title', title || 'NatureVita - Produits Naturels', true);
    updateMetaTag('og:description', description || 'Votre destination pour des produits naturels de qualité', true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', image || `${baseUrl}/logo.png`, true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || 'NatureVita - Produits Naturels');
    updateMetaTag('twitter:description', description || 'Votre destination pour des produits naturels de qualité');
    updateMetaTag('twitter:image', image || `${baseUrl}/logo.png`);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
  }, [title, description, keywords, image, type, currentUrl, baseUrl]);

  return null;
};

export default SEOHead;

