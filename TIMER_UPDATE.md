# ⏱️ Modification du Timer - 5 minutes

## 🎯 **Changements effectués :**

### **1. Durée du quiz réduite**
- **Avant** : 20 minutes (1200 secondes)
- **Après** : 5 minutes (300 secondes)

### **2. Logique des couleurs du timer adaptée**
```javascript
// Avant (20 minutes)
if (timeLeft.value <= 300) return '#f44336' // Rouge si moins de 5 minutes
if (timeLeft.value <= 600) return '#ff9800' // Orange si moins de 10 minutes

// Après (5 minutes)
if (timeLeft.value <= 60) return '#f44336'  // 🔴 Rouge si moins de 1 minute
if (timeLeft.value <= 150) return '#ff9800' // 🟠 Orange si moins de 2.5 minutes
```

### **3. Messages mis à jour**
- **App.vue** : "20 minutes" → "5 minutes"
- **Quiz.vue** : "20 minutes" → "5 minutes" dans le message de temps écoulé

### **4. Réinitialisation du timer**
- `timeLeft.value = 300` (5 minutes) dans `resetQuiz()`

## 🔄 **Nouveau comportement du timer :**

### **Couleurs selon le temps restant :**
- 🟢 **Vert** : Plus de 2.5 minutes restantes
- 🟠 **Orange** : Entre 1 et 2.5 minutes restantes  
- 🔴 **Rouge** : Moins de 1 minute restante

### **Format d'affichage :**
- **Format** : MM:SS (ex: 05:00, 04:59, 04:58...)
- **Décompte** : De 5:00 à 0:00

## 📍 **Fichiers modifiés :**

1. **`src/components/Quiz.vue`**
   - Ligne 139 : Commentaire du timer
   - Ligne 140 : `timeLeft.value = 300`
   - Ligne 167-168 : Logique des couleurs
   - Ligne 303 : Réinitialisation du timer
   - Ligne 71 : Message de temps écoulé

2. **`src/App.vue`**
   - Ligne 168 : Affichage de la durée

## ✅ **Test de la modification :**

1. **Lancer l'application** : `npm run dev`
2. **Commencer un quiz**
3. **Vérifier** :
   - Timer commence à 5:00
   - Changement de couleur à 2:30 (orange)
   - Changement de couleur à 1:00 (rouge)
   - Message de temps écoulé à 0:00

## 🎉 **Résultat :**

Le quiz est maintenant **plus court et plus dynamique** avec :
- ⏱️ **5 minutes** au lieu de 20 minutes
- 🎨 **Couleurs adaptées** au nouveau timing
- 📱 **Meilleure expérience utilisateur** pour des sessions courtes
- ⚡ **Quiz plus rapides** et engageants

## 🔧 **Pour modifier à nouveau :**

Si vous voulez changer la durée, modifiez :
```javascript
const timeLeft = ref(300) // 300 secondes = 5 minutes
// Pour 10 minutes : 600
// Pour 15 minutes : 900
// Pour 30 minutes : 1800
```
