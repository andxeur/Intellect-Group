const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Servir les fichiers statiques Vue.js

// Chemin vers le fichier results.json
const resultsPath = path.join(__dirname, 'src', 'assets', 'json', 'results.json');

// Fonction utilitaire pour s'assurer que le fichier results.json existe
async function ensureResultsFile() {
  try {
    await fs.access(resultsPath);
  } catch (error) {
    // Le fichier n'existe pas, le créer
    const initialData = { results: [] };
    await fs.writeFile(resultsPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Fichier results.json créé');
  }
}

// Route pour sauvegarder les résultats
app.post('/api/save-results', async (req, res) => {
  try {
    await ensureResultsFile();
    const newResult = req.body;
    
    // Lire le fichier existant
    const fileContent = await fs.readFile(resultsPath, 'utf8');
    const existingData = JSON.parse(fileContent);
    
    // Ajouter le nouveau résultat avec un ID unique
    const resultWithId = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...newResult
    };
    
    existingData.results.push(resultWithId);
    
    // Sauvegarder dans le fichier
    await fs.writeFile(resultsPath, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('✅ Résultat sauvegardé:', resultWithId.userInfo?.nom, resultWithId.userInfo?.prenom);
    
    res.json({ 
      success: true, 
      message: 'Résultats sauvegardés avec succès dans results.json',
      resultId: resultWithId.id,
      totalResults: existingData.results.length
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la sauvegarde des résultats',
      error: error.message
    });
  }
});

// Route pour récupérer tous les résultats
app.get('/api/results', async (req, res) => {
  try {
    const fileContent = await fs.readFile(resultsPath, 'utf8');
    const data = JSON.parse(fileContent);
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la lecture:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la lecture des résultats',
      error: error.message
    });
  }
});

// Route pour récupérer un résultat spécifique
app.get('/api/results/:id', async (req, res) => {
  try {
    const fileContent = await fs.readFile(resultsPath, 'utf8');
    const data = JSON.parse(fileContent);
    const result = data.results.find(r => r.id === req.params.id);
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Résultat non trouvé' 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la lecture:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la lecture du résultat',
      error: error.message
    });
  }
});

// Route pour supprimer un résultat spécifique
app.delete('/api/results/:id', async (req, res) => {
  try {
    await ensureResultsFile();
    const resultId = req.params.id;
    
    // Lire le fichier existant
    const fileContent = await fs.readFile(resultsPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Trouver l'index du résultat à supprimer
    const resultIndex = data.results.findIndex(r => r.id === resultId);
    
    if (resultIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Résultat non trouvé' 
      });
    }
    
    // Récupérer les infos du résultat avant suppression pour le log
    const deletedResult = data.results[resultIndex];
    
    // Supprimer le résultat
    data.results.splice(resultIndex, 1);
    
    // Sauvegarder le fichier mis à jour
    await fs.writeFile(resultsPath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`🗑️ Résultat supprimé: ${deletedResult.userInfo?.nom} ${deletedResult.userInfo?.prenom} (ID: ${resultId})`);
    
    res.json({ 
      success: true, 
      message: 'Résultat supprimé avec succès',
      deletedId: resultId,
      remainingResults: data.results.length
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression du résultat',
      error: error.message
    });
  }
});

// Route pour supprimer tous les résultats
app.delete('/api/results', async (req, res) => {
  try {
    await ensureResultsFile();
    
    // Lire le fichier existant pour compter les résultats
    const fileContent = await fs.readFile(resultsPath, 'utf8');
    const data = JSON.parse(fileContent);
    const deletedCount = data.results.length;
    
    // Vider la liste des résultats
    data.results = [];
    
    // Sauvegarder le fichier vidé
    await fs.writeFile(resultsPath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`🗑️ Tous les résultats supprimés: ${deletedCount} résultats effacés`);
    
    res.json({ 
      success: true, 
      message: 'Tous les résultats ont été supprimés avec succès',
      deletedCount: deletedCount
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du vidage:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression de tous les résultats',
      error: error.message
    });
  }
});

// Gérer les routes SPA (toutes les requêtes non-API)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Export pour Vercel
module.exports = app;

// Démarrer le serveur en local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`API disponible sur http://localhost:${PORT}/api/`);
  });
}
