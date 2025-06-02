# Orthanc Project

Un projet Next.js moderne intégrant Orthanc DICOM Server avec une interface utilisateur avancée pour la visualisation et la gestion d'images médicales.

## 🚀 Prérequis

- Node.js (v18 ou supérieur)
- Docker et Docker Compose
- Git
- PostgreSQL (via Docker)

## 📥 Installation

1. Clonez le repository :
```bash
git clone https://github.com/noreyni03/orthanc-project.git
cd orthanc-project
```

2. Créez un fichier `.env` à la racine du projet :
```env
# Base de données PostgreSQL
POSTGRES_DB=orthanc_db
POSTGRES_USER=orthanc_user
POSTGRES_PASSWORD=votre_mot_de_passe_securise

# URL de connexion Prisma
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_nextauth  # Générez avec : openssl rand -base64 32

# OAuth (optionnel)
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
```

3. Installez les dépendances :
```bash
npm install
```

4. Initialisez la base de données :
```bash
# Démarrez les conteneurs Docker
docker-compose up -d

# Exécutez les migrations Prisma
npx prisma migrate deploy

# Initialisez les données de base (optionnel)
npx prisma db seed
```

## 🚀 Démarrage du projet

1. En développement :
```bash
npm run dev
```

2. En production :
```bash
npm run build
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Structure du projet

- `/src/app` - Routes et pages Next.js
- `/src/components` - Composants React réutilisables
- `/src/lib` - Utilitaires et configuration
- `/prisma` - Schéma et migrations de base de données
- `/public` - Assets statiques

## 🔧 Configuration d'Orthanc

Le serveur Orthanc est configuré via Docker Compose avec :
- Stockage des métadonnées dans PostgreSQL
- Interface DICOMWeb activée
- Support WADO pour la récupération d'images
- CORS configuré pour le développement local

## 🛠️ Technologies principales

- **Frontend** : Next.js 14, React 18, TailwindCSS
- **Visualisation** : Cornerstone.js, Three.js
- **Base de données** : PostgreSQL, Prisma
- **DICOM** : Orthanc Server
- **Authentification** : NextAuth.js
- **UI/UX** : Headless UI, Framer Motion

## 🔐 Sécurité et Authentification

Le projet utilise NextAuth.js avec :
- Authentification locale (email/mot de passe)
- Support OAuth (Google)
- Gestion des rôles utilisateur
- Sessions sécurisées

## 🧪 Tests

Les tests peuvent être exécutés avec :
```bash
npm run test
```

## 📚 Documentation additionnelle

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Orthanc](https://book.orthanc-server.com)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Cornerstone](https://docs.cornerstonejs.org)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE)
