# api-abellan-theo

# 🚀 API Abellan Theo

API backend réalisée avec **Node.js**, **Express**, **MongoDB** et **EJS**.  
Ce projet contient un système d’authentification, des vues, ainsi que des scripts utiles pour gérer la base de données.

---

## 🧰 Technologies utilisées

- Node.js  
- Express  
- MongoDB (Mongoose)  
- EJS  
- bcryptjs  
- jsonwebtoken  
- dotenv  
- cookie-parser  
- cors  
- Nodemon (développement)

---

## 📁 Structure du projet

├── src/
│ ├── index.js # Point d’entrée du serveur
│ ├── importData.js # Script d'import de données
│ ├── models/ # Modèles Mongoose
│ ├── routes/ # Routes Express
│ ├── controllers/ # Logique métier
│ ├── middleware/ # Middlewares custom
│ └── ...
├── public/ # Fichiers statiques
├── views/ # Templates EJS
├── data/ # Fichiers d’importation
├── package.json
├── .env # Variables d’environnement (non versionné)
└── README.md


---

## ⚙️ Installation

1. Clone le projet :
```bash
git clone https://github.com/TheoAzerty/api-abellan-theo.git
cd api-abellan-theo

npm install

| Script    | Commande       | Description                            |
| --------- | -------------- | -------------------------------------- |
| **start** | `npm start`    | Lance l’application                    |
| **dev**   | `npm run dev`  | Lance avec Nodemon (auto-reload)       |
| **seed**  | `npm run seed` | Initialise la base via `importData.js` |


▶️ Lancer le projet

Mode normal :

npm start


Mode développement :

npm run dev


Importer les données :

npm run seed

📡 Routes (à compléter selon ton projet)

Exemples de structure :

Méthode	Route	Description
GET	/api/users	Récupère tous les utilisateurs
POST	/api/auth/login	Connexion
POST	/api/auth/register	Création d’un utilisateur
...	...	...
🛑 Fichiers ignorés

Assure-toi d’avoir un .gitignore avec :

node_modules/
.env

👤 Auteur

Abellan Theo
GitHub : https://github.com/TheoAzerty
