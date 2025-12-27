import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/LanguageContext';
import api from '../../services/api';

// Admin components
import AdminStats from './components/AdminStats';
import AdminOrders from './components/AdminOrders';
import AdminProducts from './components/AdminProducts';
import AdminUsers from './components/AdminUsers';
import AdminMessages from './components/AdminMessages';
import AdminReviews from './components/AdminReviews';
import AdminCategories from './components/AdminCategories';

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const translations = {
    fr: {
      title: 'Tableau de bord Admin',
      dashboard: 'Tableau de bord',
      orders: 'Commandes',
      products: 'Produits',
      users: 'Utilisateurs',
      messages: 'Messages',
      reviews: 'Avis',
      categories: 'Catégories',
      logout: 'Déconnexion',
      unauthorized: 'Accès non autorisé',
      login: 'Se connecter'
    },
    en: {
      title: 'Admin Dashboard',
      dashboard: 'Dashboard',
      orders: 'Orders',
      products: 'Products',
      users: 'Users',
      messages: 'Messages',
      reviews: 'Reviews',
      categories: 'Categories',
      logout: 'Logout',
      unauthorized: 'Unauthorized access',
      login: 'Login'
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user is admin
    if (user?.role !== 'admin') {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t.unauthorized}</h1>
        <p className="mb-6">Vous devez être administrateur pour accéder à cette page.</p>
        <Link to="/login" className="text-primary hover:underline">
          {t.login}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">{t.title}</h2>
            <nav className="space-y-2">
              <Link
                to="/admin"
                end
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.dashboard}
              </Link>
              <Link
                to="/admin/orders"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.orders}
              </Link>
              <Link
                to="/admin/products"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.products}
              </Link>
              <Link
                to="/admin/users"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.users}
              </Link>
              <Link
                to="/admin/messages"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.messages}
              </Link>
              <Link
                to="/admin/reviews"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.reviews}
              </Link>
              <Link
                to="/admin/categories"
                className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.categories}
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<AdminStats />} />
            <Route path="orders/*" element={<AdminOrders />} />
            <Route path="products/*" element={<AdminProducts />} />
            <Route path="users/*" element={<AdminUsers />} />
            <Route path="messages/*" element={<AdminMessages />} />
            <Route path="reviews/*" element={<AdminReviews />} />
            <Route path="categories/*" element={<AdminCategories />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

