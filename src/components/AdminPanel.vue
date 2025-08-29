<template>
  <div class="admin-container">
    <!-- Écran de connexion admin -->
    <div v-if="!isAuthenticated" class="login-screen">
      <div class="login-card">
        <h1>🔐 Panneau d'Administration</h1>
        <p>Accès réservé aux administrateurs</p>
        
        <form @submit.prevent="authenticate">
          <div class="form-group">
            <label for="password">Mot de passe :</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              :class="{ 'error': loginError }"
              placeholder="Entrez le mot de passe admin"
              required
            >
            <span v-if="loginError" class="error-message">{{ loginError }}</span>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="goBack" class="back-btn">← Retour</button>
            <button type="submit" class="login-btn">Se connecter</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Panneau d'administration -->
    <div v-else class="admin-dashboard">
      <div class="admin-header">
        <h1>📊 Panneau d'Administration - Intellect Group</h1>
        <div class="admin-actions">
          <button @click="refreshData" class="refresh-btn">🔄 Actualiser</button>
          <button @click="exportAllResults" class="export-btn">📥 Exporter JSON</button>
          <button @click="logout" class="logout-btn">🚪 Déconnexion</button>
        </div>
      </div>

      <!-- Statistiques globales -->
      <div class="stats-section">
        <div class="stat-card">
          <h3>👥 Total Participants</h3>
          <div class="stat-number">{{ totalParticipants }}</div>
        </div>
        <div class="stat-card">
          <h3>📈 Score Moyen</h3>
          <div class="stat-number">{{ averageScore }}%</div>
        </div>
        <div class="stat-card">
          <h3>⏱️ Temps Moyen</h3>
          <div class="stat-number">{{ averageTime }}</div>
        </div>
        <div class="stat-card">
          <h3>🏆 Meilleur Score</h3>
          <div class="stat-number">{{ bestScore }}%</div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Filtrer par classe :</label>
          <select v-model="selectedClassFilter">
            <option value="">Toutes les classes</option>
            <option v-for="classe in availableClasses" :key="classe" :value="classe">
              {{ classe }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>Trier par :</label>
          <select v-model="sortBy">
            <option value="date">Date (récent)</option>
            <option value="score">Score (décroissant)</option>
            <option value="nom">Nom (A-Z)</option>
            <option value="classe">Classe</option>
          </select>
        </div>
      </div>

      <!-- Liste des résultats -->
      <div class="results-section">
        <div class="results-header">
          <h2>📋 Résultats des Participants ({{ filteredResults.length }})</h2>
          <div class="results-actions" v-if="results.length > 0">
            <button @click="confirmClearAll" class="clear-all-btn">🗑️ Vider la liste</button>
          </div>
        </div>
        
        <div v-if="filteredResults.length === 0" class="no-results">
          <p>Aucun résultat trouvé.</p>
        </div>

        <div v-else class="results-table">
          <div class="table-header">
            <div class="col-name">Nom & Prénom</div>
            <div class="col-class">Classe</div>
            <div class="col-score">Score</div>
            <div class="col-time">Durée</div>
            <div class="col-date">Date</div>
            <div class="col-actions">Actions</div>
          </div>

          <div 
            v-for="result in filteredResults" 
            :key="result.id" 
            class="table-row"
            :class="{ 'expanded': expandedResult === result.id }"
          >
            <div class="col-name">
              <strong>{{ result.userInfo?.nom || 'N/A' }} {{ result.userInfo?.prenom || 'N/A' }}</strong>
            </div>
            <div class="col-class">{{ result.quizInfo?.classe || 'N/A' }}</div>
            <div class="col-score">
              <span class="score-badge" :class="getScoreClass(result.quizInfo?.scorePercentage || 0)">
                {{ result.quizInfo?.score || 0 }}/{{ result.quizInfo?.totalQuestions || 0 }}
                ({{ result.quizInfo?.scorePercentage || 0 }}%)
              </span>
            </div>
            <div class="col-time">{{ formatDuration(result.quizInfo?.duration || 0) }}</div>
            <div class="col-date">{{ formatDate(result.quizInfo?.date || new Date().toISOString()) }}</div>
            <div class="col-actions">
              <button 
                @click="toggleDetails(result.id)" 
                class="details-btn"
              >
                {{ expandedResult === result.id ? '▲' : '▼' }} Détails
              </button>
              <button 
                @click="confirmDeleteResult(result.id, result.userInfo?.nom, result.userInfo?.prenom)" 
                class="delete-btn"
                title="Supprimer ce résultat"
              >
                🗑️
              </button>
            </div>

            <!-- Détails étendus -->
            <div v-if="expandedResult === result.id" class="expanded-details">
              <div class="details-content">
                <h4>📊 Scores par Matière</h4>
                <div class="subject-scores">
                  <div 
                    v-for="(subjectScore, subject) in result.subjectScores" 
                    :key="subject" 
                    class="subject-item"
                  >
                    <span class="subject-name">{{ subject }}</span>
                    <span class="subject-score">
                      {{ subjectScore.correct }}/{{ subjectScore.total }}
                      ({{ Math.round((subjectScore.correct / subjectScore.total) * 100) }}%)
                    </span>
                  </div>
                </div>

                <h4>📝 Détails Techniques</h4>
                <div class="technical-details">
                  <p><strong>ID :</strong> {{ result.id }}</p>
                  <p><strong>Timestamp :</strong> {{ result.timestamp }}</p>
                  <p><strong>Durée exacte :</strong> {{ result.quizInfo.duration }} secondes</p>
                  <p><strong>Questions totales :</strong> {{ result.quizInfo.totalQuestions }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['back'])

// État d'authentification
const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')

// Mot de passe admin (en production, ceci devrait être plus sécurisé)
const ADMIN_PASSWORD = 'intellect2024'

// Données des résultats
const results = ref([])
const expandedResult = ref(null)

// Filtres
const selectedClassFilter = ref('')
const sortBy = ref('date')

// Authentification
function authenticate() {
  if (password.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    loginError.value = ''
    loadResults()
  } else {
    loginError.value = 'Mot de passe incorrect'
    password.value = ''
  }
}

function logout() {
  isAuthenticated.value = false
  password.value = ''
  results.value = []
}

function goBack() {
  emit('back')
}

// Chargement des données UNIQUEMENT depuis le serveur backend
async function loadResults() {
  try {
    console.log('🔄 Chargement des résultats depuis le serveur...')
    
    const response = await fetch('/api/results')
    if (response.ok) {
      const data = await response.json()
      results.value = data.results || []
      console.log(`✅ ${results.value.length} résultats chargés depuis le serveur`)
    } else {
      throw new Error(`Erreur serveur: ${response.status}`)
    }
  } catch (error) {
    console.error('❌ Impossible de charger les résultats:', error.message)
    results.value = []
    
    // Afficher un message d'erreur à l'admin
    alert('❌ ERREUR: Impossible de charger les résultats.\n\n' +
          'Le serveur backend n\'est pas démarré.\n\n' +
          'Pour démarrer le serveur:\n' +
          '1. Ouvrez un terminal\n' +
          '2. Tapez: node server.js\n' +
          '3. Actualisez cette page')
  }
}

function refreshData() {
  loadResults()
}

// Calculs des statistiques
const totalParticipants = computed(() => results.value.length)

const averageScore = computed(() => {
  if (results.value.length === 0) return 0
  const validResults = results.value.filter(result => 
    result.quizInfo && 
    typeof result.quizInfo.scorePercentage === 'number'
  )
  if (validResults.length === 0) return 0
  const sum = validResults.reduce((acc, result) => acc + result.quizInfo.scorePercentage, 0)
  return Math.round(sum / validResults.length)
})

const averageTime = computed(() => {
  if (results.value.length === 0) return '0m'
  const validResults = results.value.filter(result => 
    result.quizInfo && 
    typeof result.quizInfo.duration === 'number'
  )
  if (validResults.length === 0) return '0m'
  const sum = validResults.reduce((acc, result) => acc + result.quizInfo.duration, 0)
  const avgSeconds = Math.round(sum / validResults.length)
  return formatDuration(avgSeconds)
})

const bestScore = computed(() => {
  if (results.value.length === 0) return 0
  const validResults = results.value.filter(result => 
    result.quizInfo && 
    typeof result.quizInfo.scorePercentage === 'number'
  )
  if (validResults.length === 0) return 0
  return Math.max(...validResults.map(result => result.quizInfo.scorePercentage))
})

const availableClasses = computed(() => {
  const validResults = results.value.filter(result => 
    result.quizInfo && result.quizInfo.classe
  )
  const classes = [...new Set(validResults.map(result => result.quizInfo.classe))]
  return classes.sort()
})

// Filtrage et tri des résultats
const filteredResults = computed(() => {
  let filtered = results.value

  // Filtrer les résultats valides d'abord
  filtered = filtered.filter(result => 
    result.userInfo && 
    result.quizInfo && 
    result.userInfo.nom && 
    result.userInfo.prenom
  )

  // Filtrer par classe
  if (selectedClassFilter.value) {
    filtered = filtered.filter(result => 
      result.quizInfo && result.quizInfo.classe === selectedClassFilter.value
    )
  }

  // Trier
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date':
        const dateA = a.quizInfo?.date ? new Date(a.quizInfo.date) : new Date(0)
        const dateB = b.quizInfo?.date ? new Date(b.quizInfo.date) : new Date(0)
        return dateB - dateA
      case 'score':
        const scoreA = a.quizInfo?.scorePercentage || 0
        const scoreB = b.quizInfo?.scorePercentage || 0
        return scoreB - scoreA
      case 'nom':
        const nomA = a.userInfo?.nom || ''
        const nomB = b.userInfo?.nom || ''
        return nomA.localeCompare(nomB)
      case 'classe':
        const classeA = a.quizInfo?.classe || ''
        const classeB = b.quizInfo?.classe || ''
        return classeA.localeCompare(classeB)
      default:
        return 0
    }
  })

  return filtered
})

// Fonctions utilitaires
function toggleDetails(resultId) {
  expandedResult.value = expandedResult.value === resultId ? null : resultId
}

function getScoreClass(percentage) {
  if (percentage >= 80) return 'excellent'
  if (percentage >= 60) return 'good'
  if (percentage >= 40) return 'average'
  return 'poor'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function exportAllResults() {
  const dataToExport = {
    exportDate: new Date().toISOString(),
    totalResults: results.value.length,
    statistics: {
      totalParticipants: totalParticipants.value,
      averageScore: averageScore.value,
      averageTime: averageTime.value,
      bestScore: bestScore.value
    },
    results: results.value
  }

  const jsonString = JSON.stringify(dataToExport, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `intellect-group-results-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Fonctions de suppression
async function deleteResult(resultId) {
  try {
    console.log(`🗑️ Suppression du résultat ${resultId}...`)
    
    const response = await fetch(`/api/results/${resultId}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      // Supprimer localement après confirmation du serveur
      results.value = results.value.filter(result => result.id !== resultId)
      console.log(`✅ Résultat ${resultId} supprimé avec succès`)
      
      // Fermer les détails si c'était le résultat étendu
      if (expandedResult.value === resultId) {
        expandedResult.value = null
      }
    } else {
      throw new Error(`Erreur serveur: ${response.status}`)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message)
    alert('❌ ERREUR: Impossible de supprimer le résultat.\n\n' +
          'Le serveur backend n\'est pas accessible.\n\n' +
          'Vérifiez que le serveur est démarré avec: node server.js')
  }
}

async function clearAllResults() {
  try {
    console.log('🗑️ Suppression de tous les résultats...')
    
    const response = await fetch('/api/results', {
      method: 'DELETE'
    })
    
    if (response.ok) {
      // Vider la liste locale après confirmation du serveur
      results.value = []
      expandedResult.value = null
      console.log('✅ Tous les résultats ont été supprimés avec succès')
    } else {
      throw new Error(`Erreur serveur: ${response.status}`)
    }
  } catch (error) {
    console.error('❌ Erreur lors du vidage:', error.message)
    alert('❌ ERREUR: Impossible de vider la liste des résultats.\n\n' +
          'Le serveur backend n\'est pas accessible.\n\n' +
          'Vérifiez que le serveur est démarré avec: node server.js')
  }
}

// Fonctions de confirmation
function confirmDeleteResult(resultId, nom, prenom) {
  const userName = `${nom || 'N/A'} ${prenom || 'N/A'}`
  const confirmed = confirm(
    `⚠️ CONFIRMATION DE SUPPRESSION\n\n` +
    `Êtes-vous sûr de vouloir supprimer le résultat de :\n` +
    `${userName}\n\n` +
    `Cette action est irréversible !`
  )
  
  if (confirmed) {
    deleteResult(resultId)
  }
}

function confirmClearAll() {
  const confirmed = confirm(
    `⚠️ CONFIRMATION DE SUPPRESSION MASSIVE\n\n` +
    `Êtes-vous sûr de vouloir supprimer TOUS les résultats ?\n\n` +
    `${results.value.length} résultats seront définitivement supprimés.\n\n` +
    `Cette action est IRRÉVERSIBLE !`
  )
  
  if (confirmed) {
    // Double confirmation pour une action aussi critique
    const doubleConfirmed = confirm(
      `🚨 DERNIÈRE CONFIRMATION\n\n` +
      `Vous êtes sur le point de supprimer ${results.value.length} résultats.\n\n` +
      `Tapez OK pour confirmer définitivement.`
    )
    
    if (doubleConfirmed) {
      clearAllResults()
    }
  }
}

onMounted(() => {
  // Charger les données si déjà authentifié (pour les rafraîchissements)
  if (isAuthenticated.value) {
    loadResults()
  }
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  /*background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);*/
  padding: 20px;
  
  /* Responsive pour mobiles */
  @media (max-width: 768px) {
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 5px;
  }
}

/* Écran de connexion */
.login-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  background: white;
  border: 2px solid var(--accent-color);
  border-radius: 15px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    padding: 25px;
    width: 95%;
  }
}

.login-card h1 {
  color: #333;
  margin-bottom: 10px;
}

.login-card p {
  color: #666;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: space-between;
}

.back-btn, .login-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-btn {
  background: #f5f5f5;
  color: #333;
}

.back-btn:hover {
  background: #e0e0e0;
}

.login-btn {
  background: #fc663d;
  color: white;
}

.login-btn:hover {
  background: var(--accent-color);
}

/* Panneau d'administration */
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  
  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
  }
}

.admin-header {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  /* Responsive pour mobiles */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 15px;
  }
}

.admin-header h1 {
  color: #333;
  margin: 0;
}

.admin-actions {
  display: flex;
  gap: 10px;
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }
}

.refresh-btn, .export-btn, .logout-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    padding: 12px;
    width: 100%;
  }
}

.refresh-btn {
  background: #4CAF50;
  color: white;
}

.refresh-btn:hover {
  background: #45a049;
}

.export-btn {
  background: #2196F3;
  color: white;
}

.export-btn:hover {
  background: #1976D2;
}

.logout-btn {
  background: #f44336;
  color: white;
}

.logout-btn:hover {
  background: #d32f2f;
}

/* Statistiques */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    padding: 15px;
  }
}

.stat-card h3 {
  color: #666;
  margin: 0 0 10px 0;
  font-size: 14px;
}

.stat-number {
  font-size: 2em;
  font-weight: bold;
  color: #333;
}

/* Filtres */
.filters-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    gap: 12px;
    padding: 12px;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
}

.filter-group select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

/* Résultats */
.results-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* En-tête des résultats */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  /* Responsive pour mobiles */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}

.results-header h2 {
  color: #333;
  margin: 0;
}

.results-actions {
  display: flex;
  gap: 10px;
}

.clear-all-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background: #f44336;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s ease;
}

.clear-all-btn:hover {
  background: #d32f2f;
}

.col-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

.results-table {
  width: 100%;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1.5fr 1.2fr;
  gap: 15px;
  padding: 15px;
  align-items: center;
  
  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr 1.2fr;
    gap: 10px;
    padding: 12px;
    font-size: 14px;
  }
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 10px;
    text-align: left;
  }
}

.table-header {
  background: #f5f5f5;
  border-radius: 8px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  
  /* Masquer sur mobile - remplacé par des labels inline */
  @media (max-width: 480px) {
    display: none;
  }
}

.table-row {
  border-bottom: 1px solid #eee;
  transition: background 0.3s ease;
  
  /* Style mobile avec labels */
  @media (max-width: 480px) {
    background: white;
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}

.table-row:hover {
  background: #f9f9f9;
}

.score-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.score-badge.excellent {
  background: #4CAF50;
  color: white;
}

.score-badge.good {
  background: #FF9800;
  color: white;
}

.score-badge.average {
  background: #FFC107;
  color: #333;
}

.score-badge.poor {
  background: #f44336;
  color: white;
}

.details-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.details-btn:hover {
  background: #f5f5f5;
}

.delete-btn {
  padding: 6px 8px;
  border: 1px solid #f44336;
  border-radius: 6px;
  background: white;
  color: #f44336;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  min-width: 32px;
}

.delete-btn:hover {
  background: #f44336;
  color: white;
}

.expanded-details {
  grid-column: 1 / -1;
  margin-top: 15px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
}

.details-content h4 {
  color: #333;
  margin-bottom: 15px;
}

.subject-scores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid var(--accent-color);
}

.subject-name {
  font-weight: 500;
}

.technical-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .filters-section {
    flex-direction: column;
    gap: 15px;
  }

  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .table-header > div, .table-row > div {
    text-align: left;
  }

  .col-name::before { content: "Nom: "; font-weight: bold; }
  .col-class::before { content: "Classe: "; font-weight: bold; }
  .col-score::before { content: "Score: "; font-weight: bold; }
  .col-time::before { content: "Durée: "; font-weight: bold; }
  .col-date::before { content: "Date: "; font-weight: bold; }
}
</style>
