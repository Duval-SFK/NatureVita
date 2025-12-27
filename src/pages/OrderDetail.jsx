import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    fr: {
      title: 'Détails de la commande',
      orderNumber: 'N° de commande',
      date: 'Date',
      status: 'Statut',
      paymentMethod: 'Méthode de paiement',
      shippingAddress: 'Adresse de livraison',
      items: 'Articles',
      quantity: 'Quantité',
      price: 'Prix',
      subtotal: 'Sous-total',
      total: 'Total',
      pay: 'Payer maintenant',
      cancel: 'Annuler la commande',
      back: 'Retour aux commandes',
      pending: 'En attente',
      paid: 'Payée',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    },
    en: {
      title: 'Order Details',
      orderNumber: 'Order Number',
      date: 'Date',
      status: 'Status',
      paymentMethod: 'Payment Method',
      shippingAddress: 'Shipping Address',
      items: 'Items',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      total: 'Total',
      pay: 'Pay Now',
      cancel: 'Cancel Order',
      back: 'Back to Orders',
      pending: 'Pending',
      paid: 'Paid',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadOrder();
  }, [id, isAuthenticated, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.getOrder(id);
      if (response.success) {
        setOrder(response.data.order);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    try {
      await api.cancelOrder(id);
      await loadOrder();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error || 'Commande non trouvée'}</p>
        <Link to="/orders" className="text-primary hover:underline">
          {t.back}
        </Link>
      </div>
    );
  }

  const canPay = order.status === 'pending' && order.paymentStatus !== 'completed';
  const canCancel = ['pending', 'paid'].includes(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-primary hover:underline mb-4 inline-block">
          ← {t.back}
        </Link>
        <h1 className="text-3xl font-bold">{t.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.orderNumber}</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.date}</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.status}</p>
                <p className="font-semibold capitalize">{t[order.status] || order.status}</p>
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.paymentMethod}</p>
                  <p className="font-semibold">{order.paymentMethod}</p>
                </div>
              )}
            </div>

            {order.shippingAddress && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">{t.shippingAddress}</h3>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-4">{t.items}</h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                    <Link to={`/products/${item.productId}`}>
                      <img
                        src={item.productImage || '/placeholder-product.jpg'}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </Link>
                    <div className="flex-grow">
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-semibold hover:text-primary"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {t.quantity}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {parseFloat(item.subtotal).toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-gray-600">
                        {parseFloat(item.price).toLocaleString()} FCFA {t.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(canPay || canCancel) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex gap-4">
                {canPay && (
                  <Link
                    to={`/payment/${order.id}`}
                    className="flex-1 bg-primary text-white text-center py-3 rounded-md hover:bg-opacity-90"
                  >
                    {t.pay}
                  </Link>
                )}
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-red-600 text-white py-3 rounded-md hover:bg-opacity-90"
                  >
                    {t.cancel}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4">{t.total}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span>{parseFloat(order.subtotal).toLocaleString()} FCFA</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t.discount || 'Réduction'}</span>
                  <span>-{parseFloat(order.discount).toLocaleString()} FCFA</span>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>{t.total}</span>
                <span>{parseFloat(order.totalAmount).toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

