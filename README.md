# 🏛️ Application de Gestion Administrative avec Keycloak et React

Une application moderne de gestion administrative utilisant React pour le frontend et Keycloak pour l'authentification sécurisée.

![React](https://img.shields.io/badge/React-18.0+-blue.svg)
![Keycloak](https://img.shields.io/badge/Keycloak-18.0+-red.svg)
![Node.js](https://img.shields.io/badge/Node.js-14.0+-green.svg)

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation pour débutants](#installation-pour-débutants)
- [Configuration Keycloak](#configuration-keycloak)
- [Structure du projet](#structure-du-projet)
- [Démarrage de l'application](#démarrage-de-lapplication)
- [Utilisation](#utilisation)
- [Fonctionnement technique](#fonctionnement-technique)
- [Dépannage](#dépannage)
- [Personnalisation](#personnalisation)

## 🎯 Aperçu du projet

Cette application est un système de gestion administrative qui permet aux utilisateurs de gérer leurs documents administratifs. Elle utilise **Keycloak** pour l'authentification et l'autorisation, avec une distinction des rôles entre administrateurs et citoyens.

L'application frontend est développée avec **React** et communique avec des microservices backend développés avec ASP.NET, via une API Gateway utilisant YARP.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec Keycloak (connexion, inscription, déconnexion)
- 👥 **Gestion des rôles** : admin et citizen avec droits d'accès différents
- 📱 **Interface responsive** avec design moderne
- 🎭 **Pages spécifiques** selon le rôle de l'utilisateur
- 👤 **Gestion de profil** utilisateur
- 🔄 **Token management** automatique avec rafraîchissement

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 14 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **npm** ou **yarn** (inclus avec Node.js)
- **Keycloak** (version 18 ou supérieure) - [Télécharger ici](https://www.keycloak.org/downloads)
- **Java JDK 11** ou supérieure (pour Keycloak) - [Télécharger ici](https://adoptium.net/)

### Vérifier les installations

\`\`\`bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier Java
java --version
\`\`\`

## 🚀 Installation pour débutants

### Étape 1 : Cloner le projet

\`\`\`bash
# Cloner le repository
git clone https://github.com/votre-username/administrative-papers-frontend.git

# Naviguer dans le dossier du projet
cd administrative-papers-frontend
\`\`\`

### Étape 2 : Installer les dépendances

\`\`\`bash
# Avec npm (recommandé pour débutants)
npm install

# OU avec yarn
yarn install
\`\`\`

**Qu'est-ce qui se passe ?** Cette commande télécharge toutes les bibliothèques nécessaires au projet, définies dans le fichier `package.json`.

### Dépendances principales installées :

- **keycloak-js** : Client Keycloak pour JavaScript
- **@react-keycloak/web** : Intégration React pour Keycloak
- **react-router-dom** : Gestion des routes React
- **react** : Bibliothèque principale React

## 🔧 Configuration Keycloak

### Étape 1 : Télécharger et démarrer Keycloak

1. **Téléchargez Keycloak** depuis [le site officiel](https://www.keycloak.org/downloads)
2. **Extrayez** l'archive dans un dossier de votre choix
3. **Démarrez Keycloak** :

\`\`\`bash
# Naviguez vers le dossier bin de Keycloak
cd keycloak-18.0.0/bin/

# Démarrer Keycloak en mode développement
./standalone.sh -Djboss.socket.binding.port-offset=1000

# Sur Windows, utilisez :
# standalone.bat -Djboss.socket.binding.port-offset=1000
\`\`\`

Keycloak sera accessible à l'adresse : **http://localhost:8080**

### Étape 2 : Configuration initiale

1. **Accédez à la console d'administration** : http://localhost:8080
2. **Créez un compte administrateur** lors de la première visite
3. **Connectez-vous** avec vos identifiants

### Étape 3 : Créer le Realm

1. Dans la console Keycloak, cliquez sur **"Add realm"**
2. Nommez-le : **"administrative-papers"**
3. Cliquez sur **"Create"**

### Étape 4 : Créer le Client

1. Allez dans **"Clients"** → **"Create"**
2. Configurez :
   - **Client ID** : `admin-papers-web`
   - **Client Protocol** : `openid-connect`
   - **Root URL** : `http://localhost:5173`
3. Dans l'onglet **"Settings"** :
   - **Access Type** : `public`
   - **Valid Redirect URIs** : `http://localhost:5173/*`
   - **Web Origins** : `*`
4. **Sauvegardez**

### Étape 5 : Créer les Rôles

1. Allez dans **"Roles"** → **"Add Role"**
2. Créez deux rôles :
   - **admin**
   - **citizen**

### Étape 6 : Créer des Utilisateurs de test

1. Allez dans **"Users"** → **"Add user"**
2. Créez un utilisateur admin :
   - **Username** : `admin`
   - **Email** : `admin@example.com`
   - Dans l'onglet **"Credentials"**, définissez un mot de passe
   - Dans l'onglet **"Role Mappings"**, assignez le rôle **admin**
3. Créez un utilisateur citoyen de la même manière avec le rôle **citizen**

## 📁 Structure du projet

\`\`\`
src/
├── components/
│   └── Navbar.js          # Barre de navigation avec authentification
├── pages/
│   ├── HomePage.js        # Page d'accueil
│   ├── AdminPage.js       # Page réservée aux administrateurs
│   ├── CitizenPage.js     # Page réservée aux citoyens
│   └── ProfilePage.js     # Page de profil utilisateur
├── keycloak.js            # Configuration Keycloak
└── App.js                 # Composant principal de l'application
\`\`\`

### Configuration de l'application

Modifiez le fichier `keycloak.js` si nécessaire :

\`\`\`javascript
const keycloakConfig = {
  url: 'http://localhost:8080',      // URL de votre instance Keycloak
  realm: 'administrative-papers',     // Nom de votre realm
  clientId: 'admin-papers-web'        // ID de votre client
};
\`\`\`

## 🎬 Démarrage de l'application

Une fois Keycloak configuré et démarré, lancez l'application React :

\`\`\`bash
# Démarrer le serveur de développement
npm start

# OU avec yarn
yarn start
\`\`\`

L'application sera accessible à l'adresse : **http://localhost:5173**

### Que se passe-t-il au démarrage ?

1. **Vite** (le serveur de développement) compile votre code React
2. L'application se connecte à Keycloak pour vérifier l'authentification
3. Une page web s'ouvre automatiquement dans votre navigateur
4. Toute modification du code rechargera automatiquement la page

## 📖 Utilisation

### Première connexion

1. **Accédez à l'application** : http://localhost:5173
2. **Cliquez sur "Connexion"** pour vous connecter avec un compte existant
3. **Ou cliquez sur "Inscription"** pour créer un nouveau compte
4. Vous serez redirigé vers la page de login Keycloak

### Rôles et permissions

#### 👨‍💼 Administrateurs
- ✅ Accès à la page Admin (`/admin`)
- ✅ Peuvent gérer les utilisateurs et documents
- ✅ Voient des statistiques et outils d'administration

#### 👤 Citoyens
- ✅ Accès à la page Citoyen (`/citizen`)
- ✅ Peuvent gérer leurs documents personnels
- ✅ Peuvent faire des demandes administratives

### Gestion de profil

Tous les utilisateurs connectés peuvent :
- 👤 Accéder à leur page de profil (`/profile`)
- 📋 Voir leurs informations personnelles
- 🎭 Voir leurs rôles et permissions
- 🚪 Se déconnecter

## ⚙️ Fonctionnement technique

### Flux d'authentification

1. L'utilisateur clique sur **"Connexion"**
2. **Redirection** vers la page de login Keycloak
3. Après authentification, **redirection** vers l'application avec un code
4. **Échange** du code contre des tokens (access token, refresh token)
5. **Stockage** des tokens et mise à jour de l'état d'authentification
6. **Vérification** des rôles pour l'accès aux pages

### Gestion des tokens

- Les tokens sont **automatiquement rafraîchis** par la bibliothèque Keycloak
- Le **token d'accès** est inclus dans les entêtes des requêtes API
- En cas d'expiration, l'utilisateur est **redirigé** vers la page de login

### Protection des routes

Les routes protégées vérifient :
- ✅ Si l'utilisateur est **authentifié**
- ✅ Si l'utilisateur a le **rôle requis** pour accéder à la page

## 🔧 Dépannage

### Problèmes courants

#### ❌ Erreur de connexion à Keycloak
- ✅ Vérifiez que Keycloak est démarré
- ✅ Vérifiez l'URL, le realm et le clientId dans la configuration

#### ❌ Erreur CORS (Cross-Origin Resource Sharing)
- ✅ Vérifiez la configuration "Web Origins" dans Keycloak
- ✅ Assurez-vous que "Valid Redirect URIs" inclut `http://localhost:5173/*`

#### ❌ Tokens expirés
- ✅ La bibliothèque devrait normalement rafraîchir automatiquement les tokens
- ✅ Vérifiez la configuration du client dans Keycloak (temps d'expiration)

#### ❌ Accès refusé aux pages
- ✅ Vérifiez que l'utilisateur a le rôle requis
- ✅ Vérifiez l'assignation des rôles dans Keycloak

### Journalisation

Activez le mode debug pour plus d'informations :

\`\`\`javascript
// Dans keycloak.js
const keycloak = new Keycloak({
  ...keycloakConfig,
  onLoad: 'login-required', // ou 'check-sso'
  enableLogging: true
});
\`\`\`

## 🎨 Personnalisation

### Styles

Les styles sont inclus directement dans les composants via des objets JavaScript. Pour modifier l'apparence :

1. **Modifiez** les objets de style dans chaque composant
2. **Ou extrayez** les styles dans un fichier CSS séparé

### Ajout de nouvelles pages

1. **Créez** un nouveau composant dans le dossier `pages/`
2. **Ajoutez** la route dans `App.js`
3. **Implémentez** la logique de vérification des rôles si nécessaire

### Intégration avec l'API backend

Pour appeler vos microservices backend :

\`\`\`javascript
const fetchData = async () => {
  try {
    const response = await fetch('https://votre-api.com/data', {
      headers: {
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    // Traiter la réponse
  } catch (error) {
    console.error('Erreur API:', error);
  }
};
\`\`\`

## 📚 Ressources pour débutants React

### Concepts React importants utilisés dans ce projet :

- **Composants** : Blocs de construction réutilisables de l'interface
- **Props** : Données passées entre composants
- **State** : Données qui peuvent changer dans un composant
- **Hooks** : Fonctions spéciales pour gérer l'état et les effets
- **Routing** : Navigation entre différentes pages

### Liens utiles :

- [Documentation officielle React](https://react.dev/)
- [Documentation Keycloak](https://www.keycloak.org/documentation)
- [Guide React Router](https://reactrouter.com/)

## 🆘 Support

Pour toute question ou problème, veuillez consulter la documentation de :

- [Keycloak](https://www.keycloak.org/documentation)
- [React Keycloak](https://github.com/react-keycloak/react-keycloak)
- [React](https://react.dev/)

Vous pouvez également **ouvrir une issue** sur le repository du projet.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ en utilisant React et Keycloak**
