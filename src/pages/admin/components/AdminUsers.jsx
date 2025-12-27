import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import api from '../../../services/api';

const AdminUsers = () => {
  const { language } = useContext(LanguageContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.getAllUsers();
      if (response.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    fr: {
      title: 'Gestion des Utilisateurs',
      name: 'Nom',
      email: 'Email',
      role: 'Rôle',
      status: 'Statut',
      createdAt: 'Date d\'inscription',
      actions: 'Actions',
      edit: 'Modifier',
      loading: 'Chargement...'
    },
    en: {
      title: 'Users Management',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      createdAt: 'Registration Date',
      actions: 'Actions',
      edit: 'Edit',
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
              <th className="text-left p-4">{t.name}</th>
              <th className="text-left p-4">{t.email}</th>
              <th className="text-left p-4">{t.role}</th>
              <th className="text-left p-4">{t.status}</th>
              <th className="text-left p-4">{t.createdAt}</th>
              <th className="text-left p-4">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {t.edit}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

