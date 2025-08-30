# Configuration Vercel Blob pour le Quiz

## 🎯 Objectif
Remplacer le stockage en mémoire par Vercel Blob pour persister les résultats des utilisateurs après le quiz.

## 📋 Étapes de configuration

### 1. Installation des dépendances
```bash
npm install @vercel/blob multer
```

### 2. Configuration des variables d'environnement

#### En local (fichier .env.local)
```
BLOB_READ_WRITE_TOKEN=your_blob_read_write_token_here
```

#### Sur Vercel
1. Allez dans votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans "Settings" > "Environment Variables"
4. Ajoutez la variable `BLOB_READ_WRITE_TOKEN` avec votre token

### 3. Obtenir le token Vercel Blob
1. Allez dans votre dashboard Vercel
2. Cliquez sur "Storage" dans le menu de gauche
3. Créez un nouveau store Blob ou sélectionnez un existant
4. Copiez le token "Read/Write"

## 🔧 Fonctionnalités implémentées

### Stockage des résultats
- ✅ Sauvegarde automatique des résultats dans `quiz-results.json` sur Vercel Blob
- ✅ Chargement automatique des données existantes
- ✅ Persistance des données entre les déploiements

### API Endpoints
- `POST /api/save-results` - Sauvegarder un nouveau résultat
- `GET /api/results` - Récupérer tous les résultats
- `GET /api/results/:id` - Récupérer un résultat spécifique
- `DELETE /api/results/:id` - Supprimer un résultat
- `DELETE /api/results` - Supprimer tous les résultats

### Upload de fichiers (bonus)
- `POST /api/upload` - Upload de fichiers vers Vercel Blob
- `DELETE /api/upload/:pathname` - Supprimer un fichier
- `GET /api/files` - Lister tous les fichiers

## 🚀 Déploiement

1. Commitez vos changements
2. Poussez vers votre repository
3. Vercel déploiera automatiquement
4. Les données seront maintenant persistantes !

## 📊 Avantages

- ✅ **Persistance** : Les données ne sont plus perdues entre les redémarrages
- ✅ **Performance** : Accès rapide aux données
- ✅ **Fiabilité** : Stockage géré par Vercel
- ✅ **Compatibilité** : Fonctionne en local et en production
- ✅ **Évolutivité** : Facilement extensible

## 🔍 Test

Pour tester que tout fonctionne :

1. Lancez l'application en local : `npm run dev`
2. Complétez un quiz
3. Vérifiez que les données sont sauvegardées
4. Redémarrez le serveur
5. Vérifiez que les données sont toujours là

En production, les données seront automatiquement persistées dans Vercel Blob !
