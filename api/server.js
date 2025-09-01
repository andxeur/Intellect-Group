const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const { put } = require('@vercel/blob');

// Configuration de multer pour gérer les uploads de fichiers
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Servir les fichiers statiques Vue.js

// Stockage en mémoire pour Vercel (les données ne persistent pas entre les déploiements)
let resultsData = { results: [] };

// Nom du fichier JSON dans Vercel Blob pour stocker les résultats
const RESULTS_BLOB_NAME = 'quiz-results.json';

// Fonction pour charger les résultats depuis Vercel Blob
async function loadResultsFromBlob() {
  try {
    if (process.env.VERCEL) {
      const { list } = require('@vercel/blob');
      const { blobs } = await list();
      
      // Chercher le fichier results.json dans les blobs
      const resultsBlob = blobs.find(blob => blob.pathname === RESULTS_BLOB_NAME);
      
      if (resultsBlob) {
        // Télécharger et lire le contenu du fichier
        const response = await fetch(resultsBlob.url);
        const data = await response.json();
        resultsData = data;
        console.log('📥 Données chargées depuis Vercel Blob');
        return data;
      } else {
        // Créer un fichier initial si il n'existe pas
        const initialData = { results: [] };
        await saveResultsToBlob(initialData);
        resultsData = initialData;
        console.log('📝 Fichier initial créé dans Vercel Blob');
        return initialData;
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement depuis Blob:', error);
    // En cas d'erreur, utiliser les données en mémoire
    return resultsData;
  }
}

// Fonction pour sauvegarder les résultats vers Vercel Blob
async function saveResultsToBlob(data) {
  try {
    if (process.env.VERCEL) {
      const { put } = require('@vercel/blob');
      
      // Convertir les données en JSON
      const jsonData = JSON.stringify(data, null, 2);
      const buffer = Buffer.from(jsonData, 'utf8');
      
      // Upload vers Vercel Blob
      await put(RESULTS_BLOB_NAME, buffer, {
        access: 'public',
        addRandomSuffix: false, // Garder le même nom de fichier
      });
      
      console.log('💾 Données sauvegardées vers Vercel Blob');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde vers Blob:', error);
  }
}

// Chemin vers le fichier results.json (seulement pour le développement local)
const resultsPath = path.join(__dirname, '..', 'src', 'assets', 'json', 'results.json');

// Fonction utilitaire pour s'assurer que le fichier results.json existe (développement local uniquement)
async function ensureResultsFile() {
  // Sur Vercel, on utilise Vercel Blob
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
    const classe = newResult.quizInfo?.classe;
    const resultWithId = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...newResult
    };
    if (process.env.VERCEL) {
      await loadResultsFromBlob();
      if (!resultsData[classe]) resultsData[classe] = [];
      resultsData[classe].push(resultWithId);
      await saveResultsToBlob(resultsData);
      console.log('✅ Résultat sauvegardé dans Vercel Blob:', resultWithId.userInfo?.nom, resultWithId.userInfo?.prenom);
    } else {
      await ensureResultsFile();
      const fileContent = await fs.readFile(resultsPath, 'utf8');
      let existingData = JSON.parse(fileContent);
      if (!existingData[classe]) existingData[classe] = [];
      existingData[classe].push(resultWithId);
      await fs.writeFile(resultsPath, JSON.stringify(existingData, null, 2), 'utf8');
    }
    console.log('✅ Résultat sauvegardé:', resultWithId.userInfo?.nom, resultWithId.userInfo?.prenom);
    res.json({ 
      success: true, 
      message: 'Résultats sauvegardés avec succès',
      resultId: resultWithId.id,
      storage: process.env.VERCEL ? 'Vercel Blob (persistant)' : 'Fichier local'
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
      // Sur Vercel, charger depuis Blob
      const data = await loadResultsFromBlob();
      res.json(data);
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
      data = await loadResultsFromBlob();
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
      // Sur Vercel, charger depuis Blob
      await loadResultsFromBlob();
      
      const resultIndex = resultsData.results.findIndex(r => r.id === resultId);
      
      if (resultIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Résultat non trouvé' 
        });
      }
      
      const deletedResult = resultsData.results[resultIndex];
      resultsData.results.splice(resultIndex, 1);
      
      // Sauvegarder les modifications vers Blob
      await saveResultsToBlob(resultsData);
      
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
      // Sur Vercel, vider les données et sauvegarder vers Blob
      await loadResultsFromBlob();
      const deletedCount = resultsData.results.length;
      resultsData.results = [];
      
      // Sauvegarder les modifications vers Blob
      await saveResultsToBlob(resultsData);
      
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

// Route pour vérifier si un utilisateur a déjà participé
app.post('/api/check-user', async (req, res) => {
  try {
    const { nom, prenom, classe } = req.body;
    if (!nom || !prenom || !classe) {
      return res.status(400).json({
        success: false,
        message: 'Nom, prénom et classe requis'
      });
    }
    let existingData;
    if (process.env.VERCEL) {
      await loadResultsFromBlob();
      existingData = resultsData;
    } else {
      await ensureResultsFile();
      const fileContent = await fs.readFile(resultsPath, 'utf8');
      existingData = JSON.parse(fileContent);
    }
    const userExists = (existingData[classe] || []).some(result => 
      result.userInfo.nom.toLowerCase() === nom.toLowerCase() && 
      result.userInfo.prenom.toLowerCase() === prenom.toLowerCase()
    );
    res.json({
      success: true,
      exists: userExists,
      message: userExists ? 'Utilisateur déjà existant' : 'Utilisateur autorisé'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
      error: error.message
    });
  }
});

// Routes pour Vercel Blob
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const extension = path.extname(originalName);
    const fileName = `${timestamp}-${path.basename(originalName, extension)}${extension}`;

    // Upload vers Vercel Blob
    const blob = await put(fileName, req.file.buffer, {
      access: 'public',
    });

    console.log(`📁 Fichier uploadé: ${originalName} -> ${blob.url}`);

    res.json({
      success: true,
      message: 'Fichier uploadé avec succès',
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      originalName: originalName
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du fichier',
      error: error.message
    });
  }
});

// Route pour supprimer un fichier de Vercel Blob
app.delete('/api/upload/:pathname', async (req, res) => {
  try {
    const { del } = require('@vercel/blob');
    const pathname = req.params.pathname;
    
    await del(pathname);
    
    console.log(`🗑️ Fichier supprimé: ${pathname}`);
    
    res.json({
      success: true,
      message: 'Fichier supprimé avec succès',
      pathname: pathname
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du fichier',
      error: error.message
    });
  }
});

// Route pour lister les fichiers (optionnel)
app.get('/api/files', async (req, res) => {
  try {
    const { list } = require('@vercel/blob');
    
    const { blobs } = await list();
    
    res.json({
      success: true,
      files: blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }))
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des fichiers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des fichiers',
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
