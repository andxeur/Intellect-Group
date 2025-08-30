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

// Stockage en mémoire pour Vercel (les données ne persistent pas entre les déploiements)
let resultsData = { results: [] };

// Exemple avec Vercel KV (décommentez si vous voulez utiliser Vercel KV)
// const { kv } = require('@vercel/kv');

// Chemin vers le fichier results.json (seulement pour le développement local)
const resultsPath = path.join(__dirname, 'src', 'assets', 'json', 'results.json');

// Fonction utilitaire pour s'assurer que le fichier results.json existe (développement local uniquement)
async function ensureResultsFile() {
  // Sur Vercel, on utilise le stockage en mémoire
  if (process.env.VERCEL) {
    return;
  }
  
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
    const newResult = req.body;
    
    // Ajouter le nouveau résultat avec un ID unique
    const resultWithId = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...newResult
    };
    
    if (process.env.VERCEL) {
      // Sur Vercel, utiliser le stockage en mémoire
      // ⚠️ ATTENTION: Ces données seront perdues à chaque redémarrage !
      resultsData.results.push(resultWithId);
      
      // Pour persister les données, utilisez Vercel KV :
      // await kv.set('results', JSON.stringify(resultsData));
      
      console.log('⚠️ Données stockées en mémoire - elles seront perdues au redémarrage');
    } else {
      // En développement local, sauvegarder dans le fichier
      await ensureResultsFile();
      const fileContent = await fs.readFile(resultsPath, 'utf8');
      const existingData = JSON.parse(fileContent);
      existingData.results.push(resultWithId);
      await fs.writeFile(resultsPath, JSON.stringify(existingData, null, 2), 'utf8');
    }
    
    console.log('✅ Résultat sauvegardé:', resultWithId.userInfo?.nom, resultWithId.userInfo?.prenom);
    
    res.json({ 
      success: true, 
      message: 'Résultats sauvegardés avec succès',
      resultId: resultWithId.id,
      totalResults: process.env.VERCEL ? resultsData.results.length : (await fs.readFile(resultsPath, 'utf8')).results.length,
      warning: process.env.VERCEL ? 'Données stockées en mémoire - non persistantes' : null
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
    if (process.env.VERCEL) {
      // Sur Vercel, retourner les données en mémoire
      res.json(resultsData);
    } else {
      // En développement local, lire depuis le fichier
      const fileContent = await fs.readFile(resultsPath, 'utf8');
      const data = JSON.parse(fileContent);
      res.json(data);
    }
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
    let data;
    if (process.env.VERCEL) {
      data = resultsData;
    } else {
      const fileContent = await fs.readFile(resultsPath, 'utf8');
      data = JSON.parse(fileContent);
    }
    
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
    const resultId = req.params.id;
    
    if (process.env.VERCEL) {
      // Sur Vercel, utiliser le stockage en mémoire
      const resultIndex = resultsData.results.findIndex(r => r.id === resultId);
      
      if (resultIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Résultat non trouvé' 
        });
      }
      
      const deletedResult = resultsData.results[resultIndex];
      resultsData.results.splice(resultIndex, 1);
      
      console.log(`🗑️ Résultat supprimé: ${deletedResult.userInfo?.nom} ${deletedResult.userInfo?.prenom} (ID: ${resultId})`);
      
      res.json({ 
        success: true, 
        message: 'Résultat supprimé avec succès',
        deletedId: resultId,
        remainingResults: resultsData.results.length
      });
    } else {
      // En développement local, supprimer depuis le fichier
      await ensureResultsFile();
      const fileContent = await fs.readFile(resultsPath, 'utf8');
      const data = JSON.parse(fileContent);
      
      const resultIndex = data.results.findIndex(r => r.id === resultId);
      
      if (resultIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Résultat non trouvé' 
        });
      }
      
      const deletedResult = data.results[resultIndex];
      data.results.splice(resultIndex, 1);
      await fs.writeFile(resultsPath, JSON.stringify(data, null, 2), 'utf8');
      
      console.log(`🗑️ Résultat supprimé: ${deletedResult.userInfo?.nom} ${deletedResult.userInfo?.prenom} (ID: ${resultId})`);
      
      res.json({ 
        success: true, 
        message: 'Résultat supprimé avec succès',
        deletedId: resultId,
        remainingResults: data.results.length
      });
    }
    
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
    if (process.env.VERCEL) {
      // Sur Vercel, vider les données en mémoire
      const deletedCount = resultsData.results.length;
      resultsData.results = [];
      
      console.log(`🗑️ Tous les résultats supprimés: ${deletedCount} résultats effacés`);
      
      res.json({ 
        success: true, 
        message: 'Tous les résultats ont été supprimés avec succès',
        deletedCount: deletedCount
      });
    } else {
      // En développement local, vider le fichier
      await ensureResultsFile();
      const fileContent = await fs.readFile(resultsPath, 'utf8');
      const data = JSON.parse(fileContent);
      const deletedCount = data.results.length;
      
      data.results = [];
      await fs.writeFile(resultsPath, JSON.stringify(data, null, 2), 'utf8');
      
      console.log(`🗑️ Tous les résultats supprimés: ${deletedCount} résultats effacés`);
      
      res.json({ 
        success: true, 
        message: 'Tous les résultats ont été supprimés avec succès',
        deletedCount: deletedCount
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du vidage:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression de tous les résultats',
      error: error.message
    });
  }
});

// Route pour servir l'application Vue.js (fallback pour SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Démarrer le serveur seulement si on n'est pas sur Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`API disponible sur http://localhost:${PORT}/api/`);
  });
}

// Export pour Vercel
module.exports = app;
