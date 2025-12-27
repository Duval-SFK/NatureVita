import { useContext, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiEdit, FiSave, FiX } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { language } = useContext(LanguageContext);
  const { user, isAuthenticated, updateUser, logout, deleteAccount } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  
  const translations = {
    fr: {
      title: 'Mon Profil',
      tabs: {
        profile: 'Profil',
        orders: 'Commandes',
        favorites: 'Favoris',
        settings: 'Paramètres'
      },
      profile: {
        personalInfo: 'Informations Personnelles',
        name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        edit: 'Modifier',
        save: 'Enregistrer',
        cancel: 'Annuler'
      },
      orders: {
        title: 'Mes Commandes',
        noOrders: 'Vous n\'avez pas encore de commandes.',
        orderNumber: 'Commande #',
        date: 'Date',
        status: 'Statut',
        total: 'Total',
        details: 'Détails'
      },
      favorites: {
        title: 'Mes Produits Favoris',
        noFavorites: 'Vous n\'avez pas encore de produits favoris.',
        addToCart: 'Ajouter au panier'
      },
      settings: {
        title: 'Paramètres du Compte',
        changePassword: 'Changer le mot de passe',
        currentPassword: 'Mot de passe actuel',
        newPassword: 'Nouveau mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        update: 'Mettre à jour',
        deleteAccount: 'Supprimer mon compte',
        deleteWarning: 'Attention : Cette action est irréversible et supprimera toutes vos données.',
        deleteConfirm: 'Je comprends, supprimer mon compte',
        logout: 'Se déconnecter'
      }
    },
    en: {
      title: 'My Profile',
      tabs: {
        profile: 'Profile',
        orders: 'Orders',
        favorites: 'Favorites',
        settings: 'Settings'
      },
      profile: {
        personalInfo: 'Personal Information',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel'
      },
      orders: {
        title: 'My Orders',
        noOrders: 'You don\'t have any orders yet.',
        orderNumber: 'Order #',
        date: 'Date',
        status: 'Status',
        total: 'Total',
        details: 'Details'
      },
      favorites: {
        title: 'My Favorite Products',
        noFavorites: 'You don\'t have any favorite products yet.',
        addToCart: 'Add to cart'
      },
      settings: {
        title: 'Account Settings',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        update: 'Update',
        deleteAccount: 'Delete My Account',
        deleteWarning: 'Warning: This action is irreversible and will delete all your data.',
        deleteConfirm: 'I understand, delete my account',
        logout: 'Logout'
      }
    }
  };

  const t = translations[language];
  
  // Mock orders data
  const orders = [
    {
      id: '12345',
      date: '2025-05-15',
      status: language === 'fr' ? 'Livré' : 'Delivered',
      total: '75.00 €',
      items: [
        { name: 'Jinja', quantity: 2, price: '25.00 FCFA' },
        { name: 'Moringa', quantity: 1, price: '25.00 FCFA' }
      ]
    },
    {
      id: '12346',
      date: '2025-04-28',
      status: language === 'fr' ? 'En cours' : 'In Progress',
      total: '50.00 €',
      items: [
        { name: 'Baobab', quantity: 2, price: '25.00 €' }
      ]
    }
  ];
  
  // Mock favorites data
  const favorites = [
    {
      id: 1,
      name: 'Jinja',
      price: '25.00 €',
      image: '/src/assets/images/product-placeholder.svg'
    },
    {
      id: 2,
      name: 'Moringa',
      price: '25.00 €',
      image: '/src/assets/images/product-placeholder.svg'
    },
    {
      id: 3,
      name: 'Baobab',
      price: '25.00 €',
      image: '/src/assets/images/product-placeholder.svg'
    }
  ];
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSaveProfile = () => {
    updateUser(formData);
    setEditMode(false);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm(t.settings.deleteWarning)) {
      deleteAccount();
    }
  };
  
  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-10 text-center">{t.title}</h1>
        
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 p-6">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
                >
                  <FiUser />
                  <span>{t.tabs.profile}</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
                >
                  <FiShoppingBag />
                  <span>{t.tabs.orders}</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${activeTab === 'favorites' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
                >
                  <FiHeart />
                  <span>{t.tabs.favorites}</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
                >
                  <FiSettings />
                  <span>{t.tabs.settings}</span>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-primary">{t.profile.personalInfo}</h2>
                    {!editMode ? (
                      <button 
                        onClick={() => setEditMode(true)}
                        className="flex items-center space-x-2 text-primary hover:text-primary-dark"
                      >
                        <FiEdit />
                        <span>{t.profile.edit}</span>
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button 
                          onClick={handleSaveProfile}
                          className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                        >
                          <FiSave />
                          <span>{t.profile.save}</span>
                        </button>
                        <button 
                          onClick={() => setEditMode(false)}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                        >
                          <FiX />
                          <span>{t.profile.cancel}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 mb-2">{t.profile.name}</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-md">{user?.name || '-'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">{t.profile.email}</label>
                      {editMode ? (
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-md">{user?.email || '-'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">{t.profile.phone}</label>
                      {editMode ? (
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-md">{user?.phone || '-'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">{t.profile.address}</label>
                      {editMode ? (
                        <textarea 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          rows="3"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-md">{user?.address || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-6">{t.orders.title}</h2>
                  
                  {orders.length === 0 ? (
                    <p className="text-gray-500">{t.orders.noOrders}</p>
                  ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{t.orders.orderNumber}{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Livré' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                              </span>
                              <span className="font-semibold">{order.total}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between py-2 border-b last:border-0">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">{item.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-6">{t.favorites.title}</h2>
                  
                  {favorites.length === 0 ? (
                    <p className="text-gray-500">{t.favorites.noFavorites}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map(product => (
                        <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="h-48 bg-gray-100 flex items-center justify-center">
                            <img src={product.image} alt={product.name} className="h-40 w-40 object-contain" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                            <p className="text-primary font-bold mb-4">{product.price}</p>
                            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
                              {t.favorites.addToCart}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-6">{t.settings.title}</h2>
                  
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-medium mb-4">{t.settings.changePassword}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-2">{t.settings.currentPassword}</label>
                          <input 
                            type="password" 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">{t.settings.newPassword}</label>
                          <input 
                            type="password" 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">{t.settings.confirmPassword}</label>
                          <input 
                            type="password" 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
                          {t.settings.update}
                        </button>
                      </div>
                    </div>
                    
                    {/* Account Actions */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col space-y-4">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                        >
                          <FiLogOut />
                          <span>{t.settings.logout}</span>
                        </button>
                        
                        <button 
                          onClick={handleDeleteAccount}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <FiX />
                          <span>{t.settings.deleteAccount}</span>
                        </button>
                        <p className="text-sm text-red-500">{t.settings.deleteWarning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;