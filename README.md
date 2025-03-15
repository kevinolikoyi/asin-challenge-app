# asin-challenge-app
#!/bin/bash

# 1-Rendre le script exécutable
chmod +x setup.sh

# 2-Exécuter le script
./setup.sh

👉 Si une erreur de permission survient, exécute avec sudo :
sudo ./setup.sh

OU

# 1-Mettre à jour des paquets
sudo apt update -y && sudo apt upgrade -y

# 2-Installer MySQL Server s'il n'est pas installé
sudo apt install mysql-server -y

# 3-Démarrer MySQL et le configurer
sudo systemctl start mysql
sudo systemctl enable mysql

# 4-Configurer MySQL : créer la base de données et l'utilisateur
sudo mysql -e "CREATE DATABASE IF NOT EXISTS theCluster;"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
sudo mysql -e "GRANT ALL PRIVILEGES ON theCluster.* TO 'root'@'localhost' WITH GRANT OPTION;"
sudo mysql -e "FLUSH PRIVILEGES;"

# 5-Installer Node.js et npm
sudo apt install nodejs -y
sudo apt install npm -y

# 6-Installer les dépendances du projet
npm install

# 7-Exécuter le script Node.js pour insérer les données
node index.js people_sample.xlsx

# 8-Vérifier si les données sont bien insérées
sudo mysql -e "USE theCluster; SELECT COUNT(*) FROM Person;"
