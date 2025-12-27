import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import api from '../../../services/api';

const AdminMessages = () => {
  const { language } = useContext(LanguageContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await api.getAllMessages();
      if (response.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    fr: {
      title: 'Gestion des Messages',
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      status: 'Statut',
      createdAt: 'Date',
      actions: 'Actions',
      view: 'Voir',
      loading: 'Chargement...'
    },
    en: {
      title: 'Messages Management',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      status: 'Status',
      createdAt: 'Date',
      actions: 'Actions',
      view: 'View',
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
              <th className="text-left p-4">{t.subject}</th>
              <th className="text-left p-4">{t.status}</th>
              <th className="text-left p-4">{t.createdAt}</th>
              <th className="text-left p-4">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} className="border-b">
                <td className="p-4">{message.name}</td>
                <td className="p-4">{message.email}</td>
                <td className="p-4">{message.subject}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    message.status === 'unread' ? 'bg-yellow-100 text-yellow-800' :
                    message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {message.status}
                  </span>
                </td>
                <td className="p-4">{new Date(message.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {t.view}
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

export default AdminMessages;

