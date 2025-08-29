<template>
  <div class="quiz-container">

    <div class="quiz-header">
      <button @click="goBack" class="back-button">← Retour</button>
      <div class="user-info">
        <h1>Évaluation {{ selectedClass }}</h1>
        <p class="candidate-name">{{ props.userInfo?.prenom }} {{ props.userInfo?.nom }}</p>
      </div>
      <div class="timer-container">
        <div class="timer" :style="{ color: timerColor }">
          <span class="timer-icon">⏱️</span>
          <span class="timer-text">{{ formattedTime }}</span>
        </div>
      </div>
      <div class="subject-indicator">
        <span class="current-subject">{{ currentSubject }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p v-if="totalQuestions > 0">Question {{ currentQuestionIndex + 1 }} sur {{ totalQuestions }}</p>
    </div>

    <div v-if="!showResults && !showTimeUp" class="quiz-content">
      <div v-if="currentQuestion && questions.length > 0" class="question-card">
        <h2>{{ currentQuestion.question }}</h2>
        <div class="options-container">
          <button 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            @click="selectAnswer(option)"
            :class="['option-button', { 
              'selected': selectedAnswer === option,
              'correct': showAnswer && option === currentQuestion.correct_answer,
              'incorrect': showAnswer && selectedAnswer === option && option !== currentQuestion.correct_answer
            }]"
            :disabled="showAnswer"
          >
            {{ option }}
          </button>
        </div>
        
        <div class="quiz-controls">
          <button 
            v-if="!showAnswer && selectedAnswer" 
            @click="confirmAnswer" 
            class="confirm-button"
          >
            Valider
          </button>
          <button 
            v-if="showAnswer" 
            @click="nextQuestion" 
            class="next-button"
          >
            {{ currentQuestionIndex < totalQuestions - 1 ? 'Question suivante' : 'Voir les résultats' }}
          </button>
        </div>
      </div>
      
      <!-- Message de chargement -->
      <div v-else class="loading-message">
        <p>Chargement des questions...</p>
      </div>
    </div>

    <!-- Message de temps écoulé -->
    <div v-if="showTimeUp" class="time-up-container">
      <div class="time-up-card">
        <h2>⏰ Temps écoulé !</h2>
        <p>Malheureusement, le temps imparti de 20 minutes est écoulé.</p>
        <p class="failure-message">Vous avez échoué à cette évaluation.</p>
        <div class="time-up-actions">
          <button @click="goBack" class="back-button-timeup">Retour au menu</button>
        </div>
      </div>
    </div>

    <div v-if="showResults" class="results-container">
      <div class="results-card">
        <h2>Résultats de l'Évaluation {{ selectedClass }}</h2>
        <div class="score-circle">
          <div class="score-text">
            <span class="score-number">{{ score }}</span>
            <span class="score-total">/ {{ totalQuestions }}</span>
          </div>
        </div>
        <p class="score-percentage">{{ scorePercentage }}%</p>
        <p class="score-message">{{ getScoreMessage() }}</p>
        
        <!-- Scores par matière -->
        <div class="subject-scores">
          <h3>Détail par matière :</h3>
          <div class="subject-score-list">
            <div 
              v-for="(scoreData, subject) in subjectScores" 
              :key="subject" 
              class="subject-score-item"
            >
              <span class="subject-name">{{ getSubjectDisplayName(subject) }}</span>
              <span class="subject-result">{{ scoreData.correct }}/{{ scoreData.total }}</span>
              <span class="subject-percentage">{{ Math.round((scoreData.correct / scoreData.total) * 100) }}%</span>
            </div>
          </div>
        </div>
        
        <div class="results-actions">
          <button @click="restartQuiz" class="restart-button">Recommencer</button>
          <button @click="goBack" class="back-button-results">Retour au menu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import quizData from '@/assets/json/quiz.json'

const props = defineProps({
  className: String,
  userInfo: Object
})

const emit = defineEmits(['back'])

// État du quiz
const currentQuestionIndex = ref(0)
const selectedAnswer = ref('')
const showAnswer = ref(false)
const userAnswers = ref([])
const showResults = ref(false)
const showTimeUp = ref(false)
const questions = ref([])
const selectedClass = ref('')
const currentSubject = ref('')
const subjectScores = ref({})

// Timer (20 minutes = 1200 secondes)
const timeLeft = ref(1200)
const timerInterval = ref(null)
const startTime = ref(null)

// Données calculées
const currentQuestion = computed(() => {
  const question = questions.value[currentQuestionIndex.value]
  if (question) {
    currentSubject.value = getSubjectDisplayName(question.subject)
  }
  return question
})
const totalQuestions = computed(() => questions.value.length)
const progressPercentage = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
const score = computed(() => userAnswers.value.filter(answer => answer.isCorrect).length)
const scorePercentage = computed(() => Math.round((score.value / totalQuestions.value) * 100))

// Timer formaté
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Couleur du timer selon le temps restant
const timerColor = computed(() => {
  if (timeLeft.value <= 300) return '#f44336' // Rouge si moins de 5 minutes
  if (timeLeft.value <= 600) return '#ff9800' // Orange si moins de 10 minutes
  return '#4CAF50' // Vert sinon
})

// Initialisation du quiz
onMounted(() => {
  initializeQuiz()
})

function initializeQuiz() {
  selectedClass.value = props.className
  
  // Mapping des noms de classes
  const classMap = {
    'CE2 à CM2': 'CE2_CM2',
    '6ème à 3ème': '6e_3e',
    'Série A1': 'Seconde_A_Terminale_A1A2',
    'Série A2': 'Seconde_A_Terminale_A1A2',
    'Série D': 'SecondeC_TerminaleCD'
  }
  
  const mappedClass = classMap[props.className]
  
  if (mappedClass && quizData.tests[mappedClass]) {
    // Récupérer toutes les questions de toutes les matières de la classe
    const allQuestions = []
    const classData = quizData.tests[mappedClass]
    
    Object.keys(classData).forEach(subject => {
      const subjectQuestions = classData[subject]
      if (Array.isArray(subjectQuestions)) {
        subjectQuestions.forEach(question => {
          allQuestions.push({
            ...question,
            subject: subject // Ajouter la matière à chaque question
          })
        })
      }
    })
    
    // Mélanger les questions
    questions.value = shuffleArray(allQuestions)
  } else {
    // Fallback: utiliser les questions de mathématiques CE2_CM2
    const fallbackQuestions = quizData.tests.CE2_CM2.Mathematiques || []
    questions.value = fallbackQuestions.map(q => ({ ...q, subject: 'Mathematiques' }))
  }
  
  resetQuiz()
  startTimer()
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function selectAnswer(answer) {
  if (!showAnswer.value) {
    selectedAnswer.value = answer
  }
}

function confirmAnswer() {
  showAnswer.value = true
  const isCorrect = selectedAnswer.value === currentQuestion.value.correct_answer
  const subject = currentQuestion.value.subject
  
  userAnswers.value.push({
    question: currentQuestion.value.question,
    selectedAnswer: selectedAnswer.value,
    correctAnswer: currentQuestion.value.correct_answer,
    isCorrect: isCorrect,
    subject: subject
  })
  
  // Mettre à jour les scores par matière
  if (!subjectScores.value[subject]) {
    subjectScores.value[subject] = { correct: 0, total: 0 }
  }
  subjectScores.value[subject].total++
  if (isCorrect) {
    subjectScores.value[subject].correct++
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = ''
    showAnswer.value = false
  } else {
    stopTimer()
    saveResults()
    showResults.value = true
  }
}

function getSubjectDisplayName(subject) {
  const displayNames = {
    'Mathematiques': 'Mathématiques',
    'Francais': 'Français',
    'CultureGenerale': 'Culture Générale',
    'Philosophie': 'Philosophie',
    'Anglais': 'Anglais',
    'Physique': 'Physique',
    'SVT': 'SVT'
  }
  return displayNames[subject] || subject
}

function getScoreMessage() {
  const percentage = scorePercentage.value
  if (percentage >= 80) return "Excellent ! Vous maîtrisez parfaitement ces matières."
  if (percentage >= 60) return "Bien ! Vous avez de bonnes connaissances générales."
  if (percentage >= 40) return "Passable. Il y a encore des points à améliorer."
  return "Insuffisant. Il est recommandé de réviser ces matières."
}

function restartQuiz() {
  resetQuiz()
}

function resetQuiz() {
  currentQuestionIndex.value = 0
  selectedAnswer.value = ''
  showAnswer.value = false
  userAnswers.value = []
  showResults.value = false
  showTimeUp.value = false
  subjectScores.value = {}
  currentSubject.value = ''
  timeLeft.value = 1200
}

// Fonctions de gestion du timer
function startTimer() {
  startTime.value = new Date()
  timerInterval.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      timeUp()
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

function timeUp() {
  stopTimer()
  showTimeUp.value = true
  showResults.value = false
}

// Fonction de sauvegarde des résultats (UNIQUEMENT via serveur backend)
async function saveResults() {
  const endTime = new Date()
  const duration = Math.round((endTime - startTime.value) / 1000) // en secondes
  
  const resultData = {
    userInfo: {
      nom: props.userInfo.nom,
      prenom: props.userInfo.prenom
    },
    quizInfo: {
      classe: props.className,
      date: endTime.toISOString(),
      duration: duration,
      totalQuestions: totalQuestions.value,
      score: score.value,
      scorePercentage: scorePercentage.value
    },
    subjectScores: subjectScores.value,
    answers: userAnswers.value
  }
  
  try {
    console.log('🔄 Sauvegarde des résultats sur le serveur...')
    
    const response = await fetch('/api/save-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Résultats sauvegardés avec succès!')
      console.log(`📊 Participant: ${resultData.userInfo.nom} ${resultData.userInfo.prenom}`)
      console.log(`🎯 Score: ${resultData.quizInfo.score}/${resultData.quizInfo.totalQuestions} (${resultData.quizInfo.scorePercentage}%)`)
      console.log(`📈 Total participants: ${result.totalResults}`)
      
      // Afficher un message de confirmation à l'utilisateur
      alert('✅ Vos résultats ont été enregistrés avec succès!\n\nMerci d\'avoir participé au quiz Intellect Group.')
      
    } else {
      throw new Error(`Erreur serveur: ${response.status}`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error.message)
    alert('❌ Erreur: Impossible de sauvegarder vos résultats.\n\nVeuillez vérifier que le serveur est démarré et réessayer.')
  }
}

// Cette fonction n'est plus utilisée - les résultats sont uniquement sauvegardés sur le serveur
// Seul l'admin peut accéder aux résultats via le panneau d'administration

function goBack() {
  stopTimer()
  emit('back')
}
</script>

<style scoped>
.quiz-container {
  min-height: 100vh;
  /*background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);*/
  padding: 20px;
}

.quiz-header {
  text-align: center;
  color: var(--accent-color);
  margin-bottom: 30px;
  position: relative;
}

.user-info h1 {
  margin-bottom: 5px;
}

.candidate-name {
  color: var(--black-light);
  font-size: 1.1em;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

.timer-container {
  position: absolute;
  top: 10px;
  right: 10px;
  
  /* Responsive pour mobiles */
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
}

.timer {
  background: var(--accent-color);
  padding: 10px 15px;
  border-radius: 25px;
  font-size: 1.2em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    font-size: 1em;
    padding: 8px 12px;
  }
}

.timer-icon {
  font-size: 1.1em;
}

.timer-text {
  font-family: 'Courier New', monospace;
  color: white;
}

.subject-indicator {
  margin: 10px 0;
}

.current-subject {
  background: var(--accent-color);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: var(--accent-color);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  /* Responsive pour mobiles */
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    margin: 10px auto;
    display: block;
    width: fit-content;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 12px;
  }
}

.back-button:hover {
  background: #ee7a5c;
}

.progress-bar {
  width: 100%;
  max-width: 600px;
  height: 8px;
  background: rgba(197, 197, 197, 0.45);
  border-radius: 4px;
  margin: 20px auto;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--accent-color);
  transition: width 0.3s ease;
}

.quiz-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.question-card {
  background: white;
  border: 2px solid var(--accent-color);
  border-radius: 15px;
  padding: 40px;
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
  
  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    padding: 30px;
    width: 95%;
  }
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    padding: 20px;
    width: 95%;
    margin: 10px auto;
  }
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.question-card h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.4em;
  line-height: 1.5;
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    font-size: 1.2em;
    margin-bottom: 20px;
  }
}

.options-container {
  display: grid;
  gap: 15px;
  margin-bottom: 30px;
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
}

.option-button {
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  text-align: left;
  transition: all 0.3s ease;
  word-wrap: break-word;
  
  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    padding: 12px 15px;
    font-size: 14px;
  }
}

.option-button:hover:not(:disabled) {
  border-color: rgba(255, 92, 49, 0.8);
  background: #f8f9ff;
  color: var(--accent-color);
}

.option-button.selected {
  border-color: var(--accent-color);
  background: var(--accent-color);
  color: white;
}

.option-button.correct {
  border-color: #4CAF50;
  background: #4CAF50;
  color: white;
}

.option-button.incorrect {
  border-color: #f44336;
  background: #f44336;
  color: white;
}

.option-button:disabled {
  cursor: not-allowed;
}

.quiz-controls {
  text-align: center;
}

.confirm-button, .next-button {
  background: #e56847;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.confirm-button:hover, .next-button:hover {
  background: var(--accent-color);
}

.results-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.results-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(#4CAF50 0deg, #4CAF50 calc(var(--score-percentage) * 3.6deg), #e0e0e0 calc(var(--score-percentage) * 3.6deg));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  position: relative;
}

.score-circle::before {
  content: '';
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  position: absolute;
}

.score-text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-number {
  font-size: 2.5em;
  font-weight: bold;
  color: #333;
}

.score-total {
  font-size: 1.2em;
  color: #666;
}

.score-percentage {
  font-size: 1.5em;
  font-weight: bold;
  color: #4CAF50;
  margin: 10px 0;
}

.score-message {
  color: #666;
  margin: 20px 0;
  font-size: 1.1em;
}

.results-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.restart-button, .back-button-results {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.restart-button {
  background: #e8542c;
  color: white;
}

.restart-button:hover {
  background: var(--accent-color);
}

.back-button-results {
  background: #f0f0f0;
  color: #333;
}

.back-button-results:hover {
  background: #e0e0e0;
}

.loading-message {
  text-align: center;
  padding: 40px;
  color: white;
  font-size: 1.2em;
}

/* Styles pour le message de temps écoulé */
.time-up-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.time-up-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-left: 5px solid #f44336;
}

.time-up-card h2 {
  color: #f44336;
  margin-bottom: 20px;
  font-size: 2em;
}

.time-up-card p {
  color: #666;
  margin: 15px 0;
  font-size: 1.1em;
}

.failure-message {
  color: #f44336 !important;
  font-weight: bold;
  font-size: 1.2em !important;
  margin: 25px 0 !important;
}

.time-up-actions {
  margin-top: 30px;
}

.back-button-timeup {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  background: #f44336;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-button-timeup:hover {
  background: #d32f2f;
}

.subject-scores {
  margin: 25px 0;
  text-align: left;
}

.subject-scores h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.subject-score-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subject-score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
}

.subject-name {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.subject-result {
  font-weight: bold;
  color: #666;
  margin-right: 15px;
}

.subject-percentage {
  font-weight: bold;
  color: #4CAF50;
  min-width: 50px;
  text-align: right;
}

@media (max-width: 768px) {
  .quiz-container {
    padding: 10px;
  }
  
  .question-card {
    padding: 20px;
  }
  
  .results-actions {
    flex-direction: column;
  }
  
  .subject-score-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .subject-result, .subject-percentage {
    margin-right: 0;
  }
}
</style>
