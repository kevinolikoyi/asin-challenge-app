#!/bin/bash

# 1-Rendre le script exécutable

    chmod +x setup.sh

# 2-Exécuter le script

    ./setup.sh

👉 Si une erreur de permission survient, exécute avec sudo :

    sudo ./setup.sh

OU

echo "Début de l'installation et configuration..."

# 1-Mettre à jour le système
echo "Mise à jour des paquets..."
sudo apt update -y && sudo apt upgrade -y

# 2-Installer MySQL Server s'il n'est pas installé
echo "Vérification de MySQL..."
if ! command -v mysql &> /dev/null; then
  echo "Installation de MySQL..."
  sudo apt install mysql-server -y
else
  echo "MySQL est déjà installé."
fi

# 3-Démarrer MySQL et le configurer
echo "Démarrage de MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# 4-Configurer MySQL : créer la base de données et l'utilisateur
echo "Configuration de MySQL..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS theCluster;"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
sudo mysql -e "GRANT ALL PRIVILEGES ON theCluster.* TO 'root'@'localhost' WITH GRANT OPTION;"
sudo mysql -e "FLUSH PRIVILEGES;"

# 5-Installer Node.js et npm
echo "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
  echo "Installation de Node.js et npm..."
  sudo apt install nodejs -y
  sudo apt install npm -y
else
  echo "Node.js et npm sont déjà installés."
fi

# 6-Installer les dépendances du projet
echo "Installation des dépendances Node.js..."
npm install

# 7-Exécuter le script Node.js pour insérer les données
echo "Insertion des données depuis le fichier Excel..."
node index.js people_sample.xlsx

# 8-Vérifier si les données sont bien insérées
echo "Vérification des données insérées..."
sudo mysql -e "USE theCluster; SELECT COUNT(*) FROM Person;"

echo "Installation et configuration terminées avec succès !"
