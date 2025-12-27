import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import api from '../../../services/api';

const AdminReviews = () => {
  const { language } = useContext(LanguageContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await api.getAllReviews();
      if (response.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveReview(id);
      loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const translations = {
    fr: {
      title: 'Gestion des Avis',
      product: 'Produit',
      user: 'Utilisateur',
      rating: 'Note',
      comment: 'Commentaire',
      status: 'Statut',
      createdAt: 'Date',
      actions: 'Actions',
      approve: 'Approuver',
      delete: 'Supprimer',
      loading: 'Chargement...'
    },
    en: {
      title: 'Reviews Management',
      product: 'Product',
      user: 'User',
      rating: 'Rating',
      comment: 'Comment',
      status: 'Status',
      createdAt: 'Date',
      actions: 'Actions',
      approve: 'Approve',
      delete: 'Delete',
      loading: 'Loading...'
    }
  };

  const t = translations[language] || translations.fr;

  if (loading) {
    return <div className="text-center py-8">{t.loading}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">{t.product}</th>
              <th className="text-left p-4">{t.user}</th>
              <th className="text-left p-4">{t.rating}</th>
              <th className="text-left p-4">{t.comment}</th>
              <th className="text-left p-4">{t.status}</th>
              <th className="text-left p-4">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b">
                <td className="p-4">{review.productName || 'N/A'}</td>
                <td className="p-4">{review.userName || 'N/A'}</td>
                <td className="p-4">{'⭐'.repeat(review.rating)}</td>
                <td className="p-4 max-w-xs truncate">{review.comment}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {review.isApproved ? 'Approuvé' : 'En attente'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        {t.approve}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;

