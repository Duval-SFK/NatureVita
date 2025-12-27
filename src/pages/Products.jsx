import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import api from '../services/api';

const Products = () => {
  const { language } = useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [categoryFilter, priceRange, sortBy, sortOrder, searchTerm]);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      if (response.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 50,
        sortBy,
        sortOrder
      };

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (priceRange.min) {
        params.minPrice = priceRange.min;
      }

      if (priceRange.max) {
        params.maxPrice = priceRange.max;
      }

      const response = await api.getProducts(params);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    fr: {
      title: 'Nos Produits',
      subtitle: 'Découvrez notre gamme de produits naturels',
      search: 'Rechercher...',
      allCategories: 'Toutes les catégories',
      filters: 'Filtres',
      priceRange: 'Fourchette de prix',
      minPrice: 'Prix min (FCFA)',
      maxPrice: 'Prix max (FCFA)',
      sortBy: 'Trier par',
      sortOptions: {
        createdAt: 'Date d\'ajout',
        price: 'Prix',
        name: 'Nom',
        views: 'Vues'
      },
      order: 'Ordre',
      ascending: 'Croissant',
      descending: 'Décroissant',
      viewDetails: 'Voir détails',
      orderNow: 'Commander',
      currency: 'FCFA',
      noProducts: 'Aucun produit trouvé. Veuillez essayer une autre recherche.',
      loading: 'Chargement...',
      stock: 'En stock',
      outOfStock: 'Rupture de stock'
    },
    en: {
      title: 'Our Products',
      subtitle: 'Discover our range of natural products',
      search: 'Search...',
      allCategories: 'All Categories',
      filters: 'Filters',
      priceRange: 'Price Range',
      minPrice: 'Min Price (FCFA)',
      maxPrice: 'Max Price (FCFA)',
      sortBy: 'Sort By',
      sortOptions: {
        createdAt: 'Date Added',
        price: 'Price',
        name: 'Name',
        views: 'Views'
      },
      order: 'Order',
      ascending: 'Ascending',
      descending: 'Descending',
      viewDetails: 'View details',
      orderNow: 'Order now',
      currency: 'FCFA',
      noProducts: 'No products found. Please try another search.',
      loading: 'Loading...',
      stock: 'In Stock',
      outOfStock: 'Out of Stock'
    }
  };

  const t = translations[language] || translations.fr;

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl opacity-90">{t.subtitle}</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:shadow transition-shadow"
            >
              <FiFilter />
              <span>{t.filters}</span>
              <FiChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(t.sortOptions).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="ASC">{t.ascending}</option>
                <option value="DESC">{t.descending}</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.allCategories}</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">{t.allCategories}</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat.slug} value={cat.slug || cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.minPrice}</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.maxPrice}</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.slug}
                onClick={() => setCategoryFilter(cat.slug || cat.name)}
                className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                  categoryFilter === (cat.slug || cat.name)
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-light dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">{t.loading}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        {product.name}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-primary">{product.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-primary">
                        {parseFloat(product.price).toLocaleString()} {t.currency}
                      </span>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? t.stock : t.outOfStock}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                      >
                        {t.viewDetails}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">{t.noProducts}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
