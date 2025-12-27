import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    fr: {
      title: 'Mon Panier',
      empty: 'Votre panier est vide',
      continue: 'Continuer les achats',
      checkout: 'Passer la commande',
      remove: 'Retirer',
      quantity: 'Quantité',
      price: 'Prix',
      subtotal: 'Sous-total',
      total: 'Total',
      login: 'Connectez-vous pour voir votre panier',
      loginLink: 'Se connecter'
    },
    en: {
      title: 'My Cart',
      empty: 'Your cart is empty',
      continue: 'Continue shopping',
      checkout: 'Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      total: 'Total',
      login: 'Please login to view your cart',
      loginLink: 'Login'
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await api.getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(id);
      return;
    }

    try {
      await api.updateCartItem(id, newQuantity);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg mb-6">{t.login}</p>
        <Link
          to="/login"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90"
        >
          {t.loginLink}
        </Link>
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

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg mb-6">{t.empty}</p>
        <Link
          to="/products"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90"
        >
          {t.continue}
        </Link>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center gap-4"
              >
                <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                  <img
                    src={item.imageUrl || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                </Link>
                <div className="flex-grow">
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-lg font-semibold hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {parseFloat(item.price).toLocaleString()} FCFA
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-semibold">
                      {parseFloat(item.subtotal).toLocaleString()} FCFA
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">{t.total}</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span>{parseFloat(cart.total).toLocaleString()} FCFA</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-xl font-bold">
                <span>{t.total}</span>
                <span>{parseFloat(cart.total).toLocaleString()} FCFA</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-primary text-white text-center py-3 rounded-md hover:bg-opacity-90 transition"
            >
              {t.checkout}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

