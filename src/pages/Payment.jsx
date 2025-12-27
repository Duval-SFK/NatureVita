import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const translations = {
    fr: {
      title: 'Paiement',
      loading: 'Chargement...',
      redirecting: 'Redirection vers la page de paiement...',
      error: 'Erreur lors de l\'initialisation du paiement',
      retry: 'Réessayer',
      back: 'Retour aux commandes'
    },
    en: {
      title: 'Payment',
      loading: 'Loading...',
      redirecting: 'Redirecting to payment page...',
      error: 'Error initializing payment',
      retry: 'Retry',
      back: 'Back to orders'
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      initiatePayment();
    }
  }, [id, isAuthenticated, navigate]);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.initiatePayment(parseInt(id));

      if (response.success && response.data.paymentUrl) {
        // Redirect to Monetbil payment page
        window.location.href = response.data.paymentUrl;
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(err.message || t.error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>{t.redirecting}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          {error}
        </div>
        <div className="space-x-4">
          <button
            onClick={initiatePayment}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90"
          >
            {t.retry}
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-opacity-90"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Payment;

