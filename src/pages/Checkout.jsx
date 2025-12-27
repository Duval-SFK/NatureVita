import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';

const Checkout = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Cameroon',
  });
  const [notes, setNotes] = useState('');

  const translations = {
    fr: {
      title: 'Passer la commande',
      shipping: 'Adresse de livraison',
      name: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
      notes: 'Notes (optionnel)',
      promoCode: 'Code promo',
      apply: 'Appliquer',
      orderSummary: 'Résumé de la commande',
      subtotal: 'Sous-total',
      discount: 'Réduction',
      total: 'Total',
      placeOrder: 'Passer la commande',
      login: 'Connectez-vous pour passer commande',
      loginLink: 'Se connecter'
    },
    en: {
      title: 'Checkout',
      shipping: 'Shipping Address',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      country: 'Country',
      notes: 'Notes (optional)',
      promoCode: 'Promo Code',
      apply: 'Apply',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      discount: 'Discount',
      total: 'Total',
      placeOrder: 'Place Order',
      login: 'Please login to checkout',
      loginLink: 'Login'
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadCart();
  }, [isAuthenticated, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await api.getCart();
      if (response.success) {
        setCart(response.data);
        if (response.data.items.length === 0) {
          navigate('/cart');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.createOrder({
        shippingAddress,
        notes,
        promoCode: promoCode || undefined,
      });

      if (response.success) {
        // Redirect to payment
        navigate(`/payment/${response.data.order.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg mb-6">{t.login}</p>
        <button
          onClick={() => navigate('/login')}
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90"
        >
          {t.loginLink}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t.title}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{t.shipping}</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">{t.name}</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2">{t.email}</label>
                <input
                  type="email"
                  required
                  value={shippingAddress.email}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2">{t.phone}</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2">{t.address}</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">{t.city}</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block mb-2">{t.country}</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, country: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">{t.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{t.promoCode}</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Entrez le code promo"
                className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">{t.orderSummary}</h2>
            <div className="space-y-2 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{parseFloat(item.subtotal).toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span>{parseFloat(cart.total).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>{t.total}</span>
                <span>{parseFloat(cart.total).toLocaleString()} FCFA</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition mt-6 disabled:opacity-50"
            >
              {submitting ? 'Traitement...' : t.placeOrder}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

