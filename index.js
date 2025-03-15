const { Sequelize, DataTypes } = require('sequelize');
const XLSX = require('xlsx');

// Configuration de la base de données MySQL
const sequelize = new Sequelize('theCluster', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',

  dialectOptions: {
    useNative: true, // Utiliser mysql_native_password
    connectTimeout: 10000,
  },});


// Modèle de données
const Person = sequelize.define('Person', {
  matricule: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  datedenaissance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

// Lire le fichier Excel
function readExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  return data;
}

// Insérer des données dans la base de données
async function insertData(data) {
  try {
    await Person.bulkCreate(data);
    return data.length; // Retournez le nombre de lignes insérées
  } catch (error) {
    throw error;
  }
}

// Gestion des entrées et sorties
// Gestion des entrées et sorties
(async () => {
  const startTime = Date.now(); // Début du chronomètre

  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Veuillez fournir le chemin du fichier Excel.');
    process.exit(1);
  }

  try {
    const data = readExcelFile(filePath);
    console.log('Nombre de lignes du fichier Excel à insérer : ', data.length);

    const batchSize = 500; // Taille de lot à traiter par lot
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    console.log(`Divisé en ${batches.length} lots de ${batchSize} lignes.`);

    //const promises = batches.map(batch => insertData(batch)); // Créer des promesses pour chaque lot
    // Ajout d'un try-catch pour chaque promesse individuelle
    const promises = batches.map((batch, index) => {
      console.log(`Début du traitement du lot ${index + 1}...`);
      return insertData(batch)
        .then((result) => {
          console.log(`Lot ${index + 1} traité avec succès. Nombre de lignes insérées: ${result}`);
        })
        .catch((error) => {
          console.error(`Erreur dans le traitement du lot ${index + 1}:`, error.message);
        });
    });

    console.log('Attente de l\'exécution des promesses...');
    await Promise.all(promises); // Attendre que toutes les promesses se terminent

    const count = data.length; // Nombre total de lignes insérées

    const endTime = Date.now(); // Fin du chronomètre
    const totalTime = (endTime - startTime) / 1000; // Temps total en secondes
    console.log(`Les données ont été insérées avec succès. Total de lignes enregistrées : ${count}`);
    console.log(`Temps total d'exécution : ${totalTime} secondes`);
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error.message);
    console.error('Erreur de Sequelize:', error.parent ? error.parent.message : '');
    console.error('Erreur de SQL:', error.parent ? error.parent.sql : '');
  } finally {
    await sequelize.close(); // Fermez la connexion à la base de données
    console.log('Connexion à la base de données fermée.');

  }
})();