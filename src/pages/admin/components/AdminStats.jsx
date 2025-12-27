import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import api from '../../../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#2d5016', '#4a7c2a', '#6ba84a', '#8fd46b', '#b4e88d'];

const AdminStats = () => {
  const { language } = useContext(LanguageContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-8">Erreur lors du chargement</div>;
  }

  const translations = {
    fr: {
      title: 'Tableau de bord',
      totalOrders: 'Commandes totales',
      pendingOrders: 'Commandes en attente',
      totalRevenue: 'Revenus totaux',
      newUsers: 'Nouveaux utilisateurs',
      activeProducts: 'Produits actifs',
      unreadMessages: 'Messages non lus',
      recentOrders: 'Commandes récentes',
      salesChart: 'Ventes des 30 derniers jours',
      topProducts: 'Top produits',
      orderNumber: 'N° Commande',
      customer: 'Client',
      amount: 'Montant',
      status: 'Statut',
      date: 'Date',
      revenue: 'Revenus',
      orders: 'Commandes'
    },
    en: {
      title: 'Dashboard',
      totalOrders: 'Total Orders',
      pendingOrders: 'Pending Orders',
      totalRevenue: 'Total Revenue',
      newUsers: 'New Users',
      activeProducts: 'Active Products',
      unreadMessages: 'Unread Messages',
      recentOrders: 'Recent Orders',
      salesChart: 'Sales Last 30 Days',
      topProducts: 'Top Products',
      orderNumber: 'Order #',
      customer: 'Customer',
      amount: 'Amount',
      status: 'Status',
      date: 'Date',
      revenue: 'Revenue',
      orders: 'Orders'
    }
  };

  const t = translations[language] || translations.fr;

  // Format sales data for chart
  const salesData = stats.salesByDay?.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    revenue: parseFloat(item.revenue || 0),
    orders: parseInt(item.orderCount || 0)
  })) || [];

  // Format top products data
  const topProductsData = stats.topProducts?.map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    sold: parseInt(item.totalSold || 0),
    revenue: parseFloat(item.totalRevenue || 0)
  })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.title}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">{t.totalOrders}</h3>
          <p className="text-3xl font-bold">{stats.stats.totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">{t.pendingOrders}</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.stats.pendingOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">{t.totalRevenue}</h3>
          <p className="text-3xl font-bold text-green-600">
            {parseFloat(stats.stats.totalRevenue).toLocaleString()} FCFA
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">{t.newUsers}</h3>
          <p className="text-3xl font-bold">{stats.stats.newUsers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">{t.activeProducts}</h3>
          <p className="text-3xl font-bold">{stats.stats.activeProducts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-600 dark:text-gray-400 mb-2">{t.unreadMessages}</h3>
          <p className="text-3xl font-bold text-red-600">{stats.stats.unreadMessages}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{t.salesChart}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2d5016" name={t.revenue} />
              <Line type="monotone" dataKey="orders" stroke="#4a7c2a" name={t.orders} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{t.topProducts}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#2d5016" name="Vendus" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">{t.recentOrders}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t.orderNumber}</th>
                <th className="text-left p-2">{t.customer}</th>
                <th className="text-left p-2">{t.amount}</th>
                <th className="text-left p-2">{t.status}</th>
                <th className="text-left p-2">{t.date}</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.orderNumber}</td>
                  <td className="p-2">{order.customerName}</td>
                  <td className="p-2">{parseFloat(order.totalAmount).toLocaleString()} FCFA</td>
                  <td className="p-2">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
