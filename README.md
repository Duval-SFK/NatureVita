# 🌿 NatureVita - Plateforme E-commerce de Produits Naturels

Plateforme e-commerce professionnelle, sécurisée et prête pour la production, spécialisée dans la vente de produits naturels (plantes médicinales, compléments, huiles essentielles, cosmétiques naturels).

## ✨ Fonctionnalités

### 👥 Utilisateurs

#### Visiteur (non connecté)
- ✅ Consultation des produits
- ✅ Recherche et filtrage avancés
- ✅ Changement de langue (FR / EN)
- ✅ Mode clair / sombre
- ✅ Consultation des avis clients
- ✅ Contact du support
- ❌ Ne peut pas passer commande

#### Client authentifié
- ✅ Inscription / Connexion avec validation email
- ✅ Gestion du profil
- ✅ Panier d'achat
- ✅ Passage de commande
- ✅ Paiement Mobile Money (Monetbil)
- ✅ Historique des commandes
- ✅ Réception d'emails de confirmation
- ✅ Notifications de statut de commande

#### Administrateur
- ✅ Tableau de bord complet avec statistiques
- ✅ Gestion des produits (CRUD)
- ✅ Gestion des catégories
- ✅ Gestion des commandes (suivi, statuts)
- ✅ Suivi des ventes et bénéfices
- ✅ Statistiques avec graphiques
- ✅ Gestion des utilisateurs
- ✅ Consultation et réponse aux messages
- ✅ Gestion des bannières et promotions
- ✅ Gestion des codes promo
- ✅ Gestion des traductions
- ✅ Journal des activités (logs)

### 🔐 Sécurité

- ✅ Authentification JWT sécurisée
- ✅ Validation email obligatoire
- ✅ Mots de passe hashés (bcrypt)
- ✅ Protection XSS, CSRF, SQL Injection
- ✅ Rate limiting
- ✅ Headers de sécurité (Helmet)
- ✅ Validation côté client et serveur

### 🌍 Multilingue

- ✅ Système de traduction basé sur base de données
- ✅ Changement de langue sans rechargement
- ✅ Détection automatique de la langue
- ✅ Sauvegarde de la préférence utilisateur
- ✅ Traduction complète (interface, emails)

### 💳 Paiement

- ✅ Intégration Monetbil
- ✅ MTN Mobile Money
- ✅ Orange Money
- ✅ Webhook de confirmation
- ✅ Mise à jour automatique du statut
- ✅ Journalisation des transactions

### 📧 Emails

- ✅ Confirmation de commande
- ✅ Vérification email
- ✅ Réinitialisation mot de passe
- ✅ Emails multilingues

## 🚀 Installation

### Prérequis

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### 1. Cloner le projet

```bash
git clone <repository-url>
cd NatureVita
```

### 2. Base de données

```bash
# Créer la base de données
mysql -u root -p < naturevita_enhanced.sql
```

### 3. Configuration Backend

```bash
cd backend
npm install

# Copier le fichier d'exemple
cp env.example .env

# Éditer .env avec vos configurations
# Voir backend/env.example pour la liste complète
```

Variables importantes à configurer :
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `MONETBIL_SERVICE_KEY`, `MONETBIL_SERVICE_SECRET`
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`

### 4. Configuration Frontend

```bash
# À la racine du projet
npm install

# Copier le fichier d'exemple
cp env.example .env

# Éditer .env
VITE_API_URL=http://localhost:3005/api
```

### 5. Lancer l'application

#### Backend
```bash
cd backend
npm run dev  # Mode développement avec nodemon
# ou
npm start    # Mode production
```

#### Frontend
```bash
npm run dev  # Mode développement
# ou
npm run build && npm run preview  # Mode production
```

## 📁 Structure du projet

```
NatureVita/
├── backend/              # API Backend (Express)
│   ├── config/          # Configuration (DB, etc.)
│   ├── controllers/     # Contrôleurs
│   ├── middleware/       # Middleware (auth, security)
│   ├── routes/          # Routes API
│   ├── utils/           # Utilitaires (JWT, email)
│   └── server.js        # Point d'entrée
│
├── src/                 # Frontend (React)
│   ├── components/      # Composants réutilisables
│   ├── pages/           # Pages de l'application
│   ├── context/         # Contexts React
│   ├── services/        # Services API
│   ├── hooks/           # Hooks personnalisés
│   └── layouts/         # Layouts
│
├── naturevita_enhanced.sql  # Schéma base de données
├── ARCHITECTURE.md      # Documentation architecture
└── README.md           # Ce fichier
```

## 🔑 Comptes par défaut

Après l'import de la base de données :

**Admin:**
- Email: `admin@naturevita.com`
- Password: `admin123`

**Client:**
- Email: `john.doe@example.com`
- Password: `admin123`

⚠️ **Important**: Changez ces mots de passe en production !

## 📚 Documentation

- [Architecture du projet](./ARCHITECTURE.md) - Documentation technique complète
- [Variables d'environnement](./backend/env.example) - Liste des variables nécessaires

## 🛠️ Technologies utilisées

### Frontend
- React 18.2
- Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router DOM
- React Icons

### Backend
- Node.js (ES Modules)
- Express.js
- MySQL (mysql2)
- JWT (jsonwebtoken)
- Bcrypt
- Nodemailer
- Helmet, express-rate-limit

### Base de données
- MySQL 8.0+

## 🌐 API Endpoints

### Public
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails produit
- `GET /api/banners` - Bannières actives
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/translations` - Traductions

### Authentifié
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour profil
- `GET /api/cart` - Panier
- `POST /api/cart` - Ajouter au panier
- `POST /api/orders` - Créer commande
- `POST /api/payments/initiate` - Initier paiement
- `POST /api/promo-codes/validate` - Valider code promo

### Admin
- `GET /api/admin/dashboard` - Statistiques
- `GET /api/admin/orders` - Liste commandes
- `GET /api/admin/products` - Gestion produits
- `POST /api/admin/products` - Créer produit
- `GET /api/admin/users` - Liste utilisateurs
- `GET /api/admin/banners` - Gestion bannières
- `GET /api/admin/promo-codes` - Gestion codes promo

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour plus de détails.

## 🔒 Sécurité

- Tous les mots de passe sont hashés avec bcrypt (12 rounds)
- JWT avec expiration et refresh tokens
- Rate limiting sur toutes les routes
- Protection CSRF, XSS, SQL Injection
- Validation stricte des entrées
- Headers de sécurité HTTP

## 📧 Configuration Email

Pour envoyer des emails, configurez dans `.env` :

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

Pour Gmail, utilisez un "App Password" au lieu du mot de passe normal.

## 💳 Configuration Monetbil

1. Créez un compte sur [Monetbil](https://www.monetbil.com)
2. Obtenez votre `SERVICE_KEY` et `SERVICE_SECRET`
3. Configurez dans `.env` :

```env
MONETBIL_SERVICE_KEY=your-service-key
MONETBIL_SERVICE_SECRET=your-service-secret
MONETBIL_RETURN_URL=http://localhost:5173/payment/return
MONETBIL_NOTIFY_URL=http://localhost:3005/api/payments/webhook
```

## 🚢 Déploiement

### Production Checklist

- [ ] Changer tous les secrets JWT
- [ ] Configurer HTTPS
- [ ] Mettre à jour les URLs (FRONTEND_URL, BACKEND_URL)
- [ ] Configurer la base de données de production
- [ ] Configurer les emails de production
- [ ] Configurer Monetbil en mode production
- [ ] Activer les logs d'erreurs
- [ ] Configurer les backups de base de données
- [ ] Tester tous les flux (commande, paiement, emails)

### Variables d'environnement production

Assurez-vous que toutes les variables sont configurées correctement :
- `NODE_ENV=production`
- URLs de production
- Secrets sécurisés
- Configuration email de production

## 📝 Licence

Ce projet est propriétaire. Tous droits réservés.

## 👥 Support

Pour toute question ou problème :
- Email: support@naturevita.com
- Documentation: Voir [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🎯 Roadmap

- [ ] Application mobile (React Native)
- [ ] Paiement par carte bancaire
- [ ] Système de fidélité
- [ ] Chat en direct
- [ ] Recommandations IA
- [ ] API publique documentée (Swagger)

---

**Version**: 2.0  
**Dernière mise à jour**: 2025-01-14
