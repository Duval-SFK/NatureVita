# 🏗️ ARCHITECTURE DU PROJET NATUREVITA

## 📋 TABLE DES MATIÈRES
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Base de données](#base-de-données)
4. [Sécurité](#sécurité)
5. [Flux fonctionnels](#flux-fonctionnels)
6. [Déploiement](#déploiement)

---

## 🎯 VUE D'ENSEMBLE

**NatureVita** est une plateforme e-commerce professionnelle pour la vente de produits naturels (plantes médicinales, compléments, huiles essentielles, cosmétiques naturels).

### Objectifs
- ✅ Site e-commerce complet et fonctionnel
- ✅ Sécurisé et prêt pour la production
- ✅ Optimisé pour le marché africain (Mobile Money)
- ✅ Multilingue (FR/EN)
- ✅ Interface moderne et responsive

---

## 🏛️ ARCHITECTURE TECHNIQUE

### Stack technologique

#### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 6.20.0
- **Styling**: Tailwind CSS 3.3.5
- **Animations**: Framer Motion (à ajouter)
- **Icons**: React Icons 4.12.0
- **State Management**: Context API (Auth, Language, Theme)

#### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 4.18.2
- **Base de données**: MySQL 8.0+
- **ORM**: mysql2 (pool de connexions)
- **Authentification**: JWT (jsonwebtoken)
- **Sécurité**: Helmet, express-rate-limit, bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator

#### Paiement
- **Gateway**: Monetbil API
- **Méthodes**: MTN Mobile Money, Orange Money
- **Devise**: XAF (Franc CFA)

### Structure des dossiers

```
NatureVita/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuration MySQL
│   ├── controllers/
│   │   ├── authController.js    # Authentification
│   │   ├── adminController.js   # Dashboard admin
│   │   ├── paymentController.js # Paiements Monetbil
│   │   └── ...                  # Autres contrôleurs
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── security.js          # Sécurité (rate limit, sanitize)
│   │   └── errorHandler.js      # Gestion d'erreurs
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── jwt.js               # Génération tokens
│   │   └── email.js             # Envoi emails
│   └── server.js                # Point d'entrée
│
├── src/
│   ├── components/             # Composants réutilisables
│   ├── pages/                  # Pages de l'application
│   ├── context/                # Contexts React
│   ├── services/               # Services API
│   ├── hooks/                  # Hooks personnalisés
│   └── layouts/                # Layouts
│
├── naturevita_enhanced.sql     # Schéma base de données
└── package.json
```

---

## 🗄️ BASE DE DONNÉES

### Schéma principal

#### Tables utilisateurs
- **users**: Utilisateurs (clients + admins)
- **email_verifications**: Tokens de vérification email
- **activity_logs**: Journal des activités

#### Tables produits
- **categories**: Catégories de produits (hiérarchique)
- **products**: Produits avec stock, prix, images
- **reviews**: Avis clients (modération)

#### Tables commandes
- **carts**: Panier utilisateur
- **orders**: Commandes
- **order_items**: Articles de commande
- **payments**: Transactions paiement
- **promo_codes**: Codes promotionnels

#### Tables communication
- **messages**: Messages clients
- **notifications**: Notifications utilisateurs
- **banners**: Bannières promotionnelles

#### Tables système
- **translations**: Traductions multilingues
- **activity_logs**: Logs d'activité

### Relations clés
```
users (1) ──< orders (N)
orders (1) ──< order_items (N)
orders (1) ──< payments (N)
products (1) ──< order_items (N)
products (1) ──< reviews (N)
categories (1) ──< products (N)
```

### Index et performances
- Index sur colonnes fréquemment recherchées (email, slug, status)
- Index composites pour requêtes complexes
- Triggers pour génération automatique (orderNumber)
- Vues matérialisées pour statistiques

---

## 🔐 SÉCURITÉ

### Authentification
- **JWT**: Tokens signés avec secret
- **Refresh Tokens**: Renouvellement automatique
- **Bcrypt**: Hashage mots de passe (12 rounds)
- **Email Verification**: Validation obligatoire

### Protection
- **Helmet**: Headers de sécurité HTTP
- **Rate Limiting**: 
  - API: 100 req/15min
  - Auth: 5 req/15min
- **CORS**: Origines autorisées uniquement
- **Input Sanitization**: Protection XSS
- **SQL Injection**: Requêtes préparées (mysql2)
- **CSRF**: Tokens pour actions sensibles

### Validation
- **express-validator**: Validation côté serveur
- **Validation client**: Double vérification
- **Sanitization**: Nettoyage des entrées

---

## 🔄 FLUX FONCTIONNELS

### 1. Inscription utilisateur
```
1. Utilisateur remplit formulaire
2. Backend vérifie email unique
3. Hashage mot de passe (bcrypt)
4. Création compte (isEmailVerified = false)
5. Génération token vérification
6. Envoi email avec lien
7. Utilisateur clique lien
8. Email vérifié → peut commander
```

### 2. Passage de commande
```
1. Utilisateur ajoute produits au panier
2. Vérification stock disponible
3. Récapitulatif commande
4. Application code promo (optionnel)
5. Création commande (status: pending)
6. Redirection paiement Monetbil
7. Choix méthode (MTN/Orange)
8. Webhook confirmation
9. Mise à jour commande (status: paid)
10. Email confirmation
11. Notification utilisateur
```

### 3. Paiement Monetbil
```
1. Initiation paiement
   - Création enregistrement payment
   - Préparation données Monetbil
   - Génération signature HMAC-SHA256
   - Appel API Monetbil
   - Retour payment_url

2. Redirection utilisateur
   - Choix méthode paiement
   - Validation côté Monetbil

3. Webhook retour
   - Vérification signature
   - Mise à jour payment
   - Mise à jour order
   - Email confirmation
   - Notification
```

### 4. Administration
```
Dashboard:
- Statistiques (ventes, commandes, utilisateurs)
- Graphiques (revenus, tendances)
- Commandes récentes
- Alertes (stock faible, messages non lus)

Gestion produits:
- CRUD complet
- Upload images
- Gestion stock
- Catégories

Gestion commandes:
- Liste avec filtres
- Détails commande
- Mise à jour statut
- Suivi paiements

Gestion utilisateurs:
- Liste utilisateurs
- Détails profil
- Activation/désactivation

Messages:
- Liste messages
- Réponse aux clients
- Statut (lu/non lu)
```

---

## 🌍 MULTILINGUE

### Système de traduction

#### Backend
- Table `translations` avec clés
- API pour récupérer traductions
- Cache des traductions

#### Frontend
- Context `LanguageContext`
- Hook `useTranslation`
- Détection automatique langue navigateur
- Sauvegarde préférence localStorage
- Changement sans rechargement

#### Structure
```json
{
  "key": "welcome",
  "language": "fr",
  "value": "Bienvenue",
  "context": "general"
}
```

---

## 🎨 UI/UX

### Design System
- **Couleurs**: Palette nature (vert #2d5016)
- **Typographie**: Arial, système
- **Espacement**: Tailwind (4px base)
- **Composants**: Réutilisables, accessibles

### Responsive
- Mobile First
- Breakpoints Tailwind
- Navigation adaptative

### Animations
- Framer Motion pour transitions
- Micro-interactions
- Loading states
- Hover effects

### Accessibilité
- Contraste WCAG AA
- Navigation clavier
- ARIA labels
- Focus visible

---

## 💳 PAIEMENT MOBILE MONEY

### Configuration Monetbil

#### Variables d'environnement
```env
MONETBIL_SERVICE_KEY=****
MONETBIL_SERVICE_SECRET=****
MONETBIL_RETURN_URL=http://localhost:8081/payment/return
MONETBIL_NOTIFY_URL=http://localhost:3005/api/payments/webhook
```

#### Flux
1. **Initiation**: POST `/api/payments/initiate`
2. **Redirection**: Utilisateur vers `payment_url`
3. **Webhook**: POST `/api/payments/webhook` (signature vérifiée)
4. **Confirmation**: Email + notification

#### Sécurité
- Signature HMAC-SHA256
- Vérification montant
- Logs transactions
- Gestion échecs

---

## 📧 EMAILS

### Types d'emails

1. **Vérification email**
   - Lien avec token
   - Expiration 24h

2. **Confirmation commande**
   - Résumé commande
   - Numéro commande
   - Articles
   - Montant total
   - Multilingue

3. **Réinitialisation mot de passe**
   - Lien avec token
   - Expiration 1h

### Configuration
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@naturevita.com
EMAIL_FROM_NAME=NatureVita
```

---

## 🚀 DÉPLOIEMENT

### Prérequis
- Node.js 18+
- MySQL 8.0+
- Variables d'environnement configurées

### Étapes

1. **Base de données**
   ```bash
   mysql -u root -p < naturevita_enhanced.sql
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend**
   ```bash
   npm install
   npm run build
   npm run preview
   ```

### Variables d'environnement

Voir `.env.example` pour la liste complète.

### Production
- HTTPS obligatoire
- Variables sensibles en secrets
- Monitoring (logs, erreurs)
- Backup base de données
- CDN pour assets statiques

---

## 📊 MÉTRIQUES & MONITORING

### Logs
- Activity logs (base de données)
- Server logs (console/file)
- Error logs (séparés)

### Statistiques
- Dashboard admin
- Graphiques ventes
- Taux conversion
- Produits populaires

---

## 🔄 AMÉLIORATIONS FUTURES

- [ ] Application mobile (React Native)
- [ ] Paiement par carte bancaire
- [ ] Système de fidélité
- [ ] Chat en direct
- [ ] Recommandations IA
- [ ] Export données (CSV/Excel)
- [ ] API publique (documentation Swagger)

---

## 📝 NOTES TECHNIQUES

### Performance
- Pool de connexions MySQL
- Cache des traductions
- Compression responses (gzip)
- Lazy loading images

### Scalabilité
- Architecture modulaire
- Séparation frontend/backend
- API RESTful
- Prêt pour microservices

### Maintenance
- Code commenté
- Structure claire
- Documentation complète
- Tests (à ajouter)

---

**Version**: 2.0  
**Dernière mise à jour**: 2025-01-14  
**Auteur**: Équipe NatureVita

