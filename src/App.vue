<template>
  <!-- Interface principale moderne (masquée si admin ou quiz actif) -->
  <div v-if="!showQuiz && !showAdmin" class="modern-app">
    <NavBar/>
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">Intellect-Group</span>
              <br>Excellence Éducative
            </h1>
            <p class="hero-description">
              Découvrez une nouvelle façon d'apprendre avec nos évaluations interactives. 
              Testez vos connaissances et progressez à votre rythme dans un environnement 
              stimulant et bienveillant.
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">500+</span>
                <span class="stat-label">Étudiants</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">95%</span>
                <span class="stat-label">Réussite</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">3</span>
                <span class="stat-label">Niveaux</span>
              </div>
            </div>
            <button class="cta-button" @click="scrollToQuizSection">
              <span>Commencer l'évaluation</span>
              <svg class="arrow-icon" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div class="hero-image">
            <div class="image-container">
              <img src="./assets/image/young_woman_reading.svg" alt="Étudiante en apprentissage">
              <div class="floating-elements">
                <div class="floating-card card-1">
                  <img src="./assets/image/graduation_cap.svg" alt="Diplôme">
                  <span>Excellence</span>
                </div>
                <div class="floating-card card-2">
                  <img src="./assets/image/learn.svg" alt="Apprentissage">
                  <span>Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="about-container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="section-title">Qu'est-ce que Intellect-Group ?</h2>
            <p class="section-description">
              Intellect-Group est votre partenaire de confiance pour l'excellence éducative en Côte d'Ivoire. 
              Nous proposons des évaluations personnalisées et des solutions pédagogiques innovantes 
              pour tous les niveaux scolaires.
            </p>
            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-icon">
                  <img src="./assets/image/teacher.svg" alt="Enseignants qualifiés">
                </div>
                <h3>Enseignants Experts</h3>
                <p>Une équipe pédagogique qualifiée et expérimentée</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <img src="./assets/image/graduation_cap.svg" alt="Excellence académique">
                </div>
                <h3>Excellence Académique</h3>
                <p>Des méthodes éprouvées pour garantir votre réussite</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <img src="./assets/image/people.svg" alt="Accompagnement personnalisé">
                </div>
                <h3>Suivi Personnalisé</h3>
                <p>Un accompagnement adapté à vos besoins spécifiques</p>
              </div>
            </div>
          </div>
          <div class="series-showcase">
            <h3>Nos Spécialités</h3>
            <div class="series-grid">
              <div class="series-card series-a">
                <div class="series-letter">A</div>
                <div class="series-info">
                  <h4>Série A</h4>
                  <p>Littéraire & Sciences Humaines</p>
                </div>
              </div>
              <div class="series-card series-d">
                <div class="series-letter">D</div>
                <div class="series-info">
                  <h4>Série D</h4>
                  <p>Sciences Expérimentales</p>
                </div>
              </div>
              <div class="series-card series-c">
                <div class="series-letter">C</div>
                <div class="series-info">
                  <h4>Série C</h4>
                  <p>Mathématiques & Sciences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quiz Section -->
    <section id="quiz-section" class="quiz-section">
      <div class="quiz-container">
        <div class="quiz-header">
          <h2 class="section-title">Choisissez Votre Évaluation</h2>
          <p class="section-description">
            Sélectionnez le niveau qui correspond à votre profil et commencez votre évaluation personnalisée.
            Chaque test est conçu pour mesurer vos compétences de manière précise et bienveillante.
          </p>
        </div>
        
        <div class="quiz-cards">
          <div 
            v-for="quiz in dics" 
            :key="quiz.id" 
            class="quiz-card"
            @click="startMultiSubjectQuiz(quiz.classe)"
          >
            <div class="quiz-card-header">
              <div class="quiz-icon">
                <img src="./assets/image/graduation_cap.svg" alt="Graduation">
              </div>
              <h3 class="quiz-title">{{ quiz.classe }}</h3>
            </div>
            
            <div class="quiz-card-body">
              <p class="quiz-description">{{ quiz.description }}</p>
              
              <div class="quiz-subjects">
                <h4>Matières évaluées :</h4>
                <div class="subjects-list">
                  <span 
                    v-for="matiere in quiz.listeMatier" 
                    :key="matiere" 
                    class="subject-tag"
                  >
                    {{ matiere }}
                  </span>
                </div>
              </div>
              
              <div class="quiz-info">
                <div class="info-item">
                  <img src="./assets/image/clock.svg" alt="Durée">
                  <span>20 minutes</span>
                </div>
                <div class="info-item">
                  <img src="./assets/image/file.svg" alt="Questions">
                  <span>15 questions</span>
                </div>
              </div>
            </div>
            
            <div class="quiz-card-footer">
              <button class="quiz-start-btn">
                <span>Commencer l'évaluation</span>
                <svg class="btn-arrow" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-section">
      <div class="why-choose-container">
        <h2 class="section-title">Pourquoi choisir Intellect-Group ?</h2>
        <div class="advantages-grid">
          <div v-for="mention in mentions" :key="mention.id" class="advantage-card">
            <div class="advantage-icon">
              <img :src="require(`@/assets/image/${mention.image}`)" :alt="mention.alt">
            </div>
            <h3>{{ mention.titre }}</h3>
            <p>{{ mention.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <Footer/>
    
    <!-- Lien discret pour l'administration -->
    <div class="admin-link-container">
      <button @click="openAdminPanel" class="admin-link" title="Accès administrateur">
        ⚙️
      </button>
    </div>
  </div>
  
  <!-- Composant UserForm -->
  <UserForm 
    :show="showUserForm"
    :userInfo="userInfo"
    @close="closeUserForm"
    @submit="handleUserFormSubmit"
  />

  <!-- Composant Quiz Multi-Matières -->
  <Quiz
    v-if="showQuiz"
    :className="selectedClassName"
    :userInfo="userInfo"
    @back="backToHome"
  />

  <!-- Panneau d'Administration (plein écran) -->
  <AdminPanel
    v-if="showAdmin"
    @back="backToHome"
  />

</template>

<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Quiz from './components/Quiz.vue'
import AdminPanel from './components/AdminPanel.vue'
import UserForm from './components/UserForm.vue'

// État de l'application
const showQuiz = ref(false)
const showUserForm = ref(false)
const showAdmin = ref(false)
const selectedClassName = ref('')
const userInfo = ref({ nom: '', prenom: '' })
let dics = [
  {
    classe: "CE2 à CM2",
    description: "Évaluation pour les classes de CE2 à CM1",
    listeMatier: ["Écriture","Règles de grammaire","Culture générale"],
    couleur: "#77D0B8",
  },
  {
    classe: "6ème à 3ème",
    description: "Évaluation pour le collège",
    listeMatier: ["Mathématiques","Français","Histoire-Géo","Culture générale","Physique-Chimie","Logique"],
    couleur: "#1A9797",
  },
  {
    classe: "Série A2",
    description: "Évaluation pour la série A2",
    listeMatier: ["Philosophie","Français","Anglais"],
    couleur: "#3693A5",
  },
  {
    classe: "Série A1",
    description: "Évaluation pour la série A1",
    listeMatier: ["Mathématiques","Histoire-Géo","Physique","Philosophie","Français"],
    couleur: "#D0779B",
  },
  {
    classe: "Série D",
    description: "Évaluation pour la série D",
    listeMatier: ["SVT","Mathématiques","Physique"],
    couleur: "#E1666F",
  },
]

let mentions = [
  {
    titre: "Professeurs Qualifiés",
    description: "Nos enseignants sont rigoureusement sélectionnés et évalués pour garantir la qualité de l'enseignement.",
    image: "graduation_cap.svg",
    alt: "graduation_cap",
  },
  {
    titre: "Excellence Garantie",
    description: "Notre devise \"L'excellence à tout prix\" reflète notre engagement envers la réussite de nos élèves.",
    image: "laurel_wreath 2.svg",
    alt: "laurel_wreath",
  },
  {
    titre: "Toutes Séries",
    description: "Nous couvrons toutes les séries (A, \n" +
        "D, C) et tous les niveaux du primaire \n" +
        "au secondaire.",
    image: "people.svg",
    alt: "people",

  },
]

// Fonctions
function startMultiSubjectQuiz(className) {
  selectedClassName.value = className
  showUserForm.value = true
}

// Gestionnaire de soumission du formulaire utilisateur
function handleUserFormSubmit(userData) {
  // Mettre à jour les informations utilisateur
  userInfo.value = userData
  
  // Fermer la modal et démarrer le quiz
  showUserForm.value = false
  showQuiz.value = true
}

function closeUserForm() {
  showUserForm.value = false
  selectedClassName.value = ''
  userInfo.value = { nom: '', prenom: '' }
}

function backToHome() {
  showQuiz.value = false
  showUserForm.value = false
  showAdmin.value = false
  selectedClassName.value = ''
  userInfo.value = { nom: '', prenom: '' }
}

function openAdminPanel() {
  showAdmin.value = true
  showQuiz.value = false
  showUserForm.value = false
}

function scrollToQuizSection() {
  const quizSection = document.getElementById('quiz-section')
  if (quizSection) {
    quizSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style>
/* ===============================================
   MODERN RESPONSIVE DESIGN - INTELLECT GROUP
   =============================================== */

/* Reset et Variables CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #FF5C31;
  --primary-dark: #e54a28;
  --secondary-color: #3693A5;
  --accent-color: #fd4b1b;
  --black-light: #2E303C;
  --text-dark: #2d3748;
  --text-light: #718096;
  --background-light: #f7fafc;
  --white: #ffffff;
  --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 10px 25px rgba(0, 0, 0, 0.1);
  --shadow-heavy: 0 20px 40px rgba(0, 0, 0, 0.15);
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Layout Principal */
.modern-app {
  min-height: 100vh;
  background: var(--white);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ===============================================
   HERO SECTION
   =============================================== */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 80px; /* Compensation pour la navbar fixe */
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /*background: linear-gradient(135deg, rgba(255, 92, 49, 0.9) 0%, rgba(54, 147, 165, 0.9) 100%);*/
  z-index: 1;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  /*color: var(--white);*/
  color: #2E303C;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  color: var(--primary-color); /* Orange uni #FF5C31 */
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-color);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-medium);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-heavy);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.hero-image {
  position: relative;
}

.image-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.image-container img {
  width: 100%;
  height: auto;
  /*filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));*/
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.floating-card {
  position: absolute;
  background: var(--white);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-dark);
  animation: float 6s ease-in-out infinite;
}

.floating-card img {
  width: 24px;
  height: 24px;
}

.card-1 {
  top: 20%;
  right: -10%;
  animation-delay: 0s;
}

.card-2 {
  bottom: 30%;
  left: -10%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* ===============================================
   ABOUT SECTION
   =============================================== */
.about-section {
  padding: 6rem 0;
  background: var(--background-light);
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.section-description {
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.features-grid {
  display: grid;
  gap: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.feature-item h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: var(--text-light);
  line-height: 1.5;
}

.series-showcase h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1.5rem;
}

.series-grid {
  display: grid;
  gap: 1rem;
}

.series-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
}

.series-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.series-letter {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
}

.series-a .series-letter {
  background: var(--primary-color); /* Orange uni #FF5C31 */
}

.series-d .series-letter {
  background: var(--secondary-color); /* Bleu uni #3693A5 */
}

.series-c .series-letter {
  background: var(--text-dark); /* Gris foncé #2E303C */
}

.series-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}

.series-info p {
  color: var(--text-light);
  font-size: 0.9rem;
}

/* ===============================================
   QUIZ SECTION
   =============================================== */
.quiz-section {
  padding: 6rem 0;
  background: var(--white);
}

.quiz-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.quiz-header {
  text-align: center;
  margin-bottom: 4rem;
}

.quiz-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.quiz-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  border: 2px solid transparent;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-heavy);
  border-color: var(--primary-color);
}

.quiz-card-header {
  padding: 1.5rem;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  color: var(--white);
  text-align: center;
}

.quiz-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.quiz-icon img {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.quiz-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.quiz-card-body {
  padding: 1.5rem;
}

.quiz-description {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.quiz-subjects h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
}

.subjects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.subject-tag {
  background: var(--background-light);
  color: var(--text-dark);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.quiz-info {
  display: flex;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.info-item img {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.quiz-card-footer {
  padding: 0 1.5rem 1.5rem;
}

.quiz-start-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.quiz-start-btn:hover {
  background: var(--primary-dark); /* Orange plus foncé */
}

.btn-arrow {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

/* ===============================================
   WHY CHOOSE SECTION
   =============================================== */
.why-choose-section {
  padding: 6rem 0;
  background: var(--background-light);
}

.why-choose-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.advantage-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  transition: var(--transition);
}

.advantage-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.advantage-icon {
  width: 80px;
  height: 80px;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.advantage-icon img {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
}

.advantage-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.advantage-card p {
  color: var(--text-light);
  line-height: 1.5;
}

/* ===============================================
   ADMIN LINK
   =============================================== */
.admin-link-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.admin-link {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  color: var(--white);
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-medium);
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-link:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-heavy);
}

/* ===============================================
   RESPONSIVE DESIGN
   =============================================== */

/* Tablettes */
@media (max-width: 1024px) {
  .hero-content {
    gap: 3rem;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .about-content {
    gap: 3rem;
  }
  
  .quiz-cards {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

/* Tablettes Portrait */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .floating-card {
    display: none;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .quiz-cards {
    grid-template-columns: 1fr;
  }
  
  .advantages-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Mobiles */
@media (max-width: 480px) {
  .hero-container,
  .about-container,
  .quiz-container,
  .why-choose-container {
    padding: 0 1rem;
  }
  
  .hero-section {
    min-height: 80vh;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-description {
    font-size: 1rem;
  }
  
  .features-grid {
    gap: 1.5rem;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
  }
  
  .quiz-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .quiz-card-header {
    padding: 1rem;
  }
  
  .quiz-card-body {
    padding: 1rem;
  }
  
  .subjects-list {
    justify-content: center;
  }
  
  .quiz-info {
    justify-content: center;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .advantage-card {
    padding: 1.5rem;
  }
  
  .admin-link-container {
    bottom: 1rem;
    right: 1rem;
  }
  
  .admin-link {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
}

/* ===============================================
   NETTOYAGE TERMINÉ - ANCIENS STYLES SUPPRIMÉS
   =============================================== */



.presentation{
  flex-direction: column;
  height: 60vh;

  .partie-haut{
    display: flex;
    width: 100%;
    height: 70%;

    .partie-gauche{
      display: flex;
      width: 50%;
      height: 100%;
      justify-content: center;
      align-items: center;

      .partie-gauche-container{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 90%;
        justify-content: space-between;

        .titre-container{
          display: flex;
          width: 100%;

          h2{
            align-content: end;
            margin-left: 1%;
          }
        }

        .info-niveau{
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 70%;
          background-color: #3693A5;
          padding: 1%;
          color: white;
          border-radius: 10px;

          >p{
            margin-top: 2%;
          }

          .text-direction{
            display: flex;
            margin-top: auto;
            align-items: center;
            justify-content: flex-end;

            p{
              text-decoration: underline;
            }

            img{
              margin-left: 1%;
              width: 20px;
              height: 20px;
            }
          }
        }
      }


    }

    .partie-droite{
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img{
        width: 90%;
        height: 90%;
      }
    }
  }

  .partie-bas{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 30%;
    background-color: white;
    text-align: center;
    color: #FF5C31;
    padding-top: 2%;
    padding-bottom: 2%;

    p{
      margin-top: 1%;
      color: #2E303C;
    }

  }
}


.section-classe-didponible{
  padding: 3% 5%;
  background-color: white;

  .liste-classe-container{
    display: flex;
    flex-wrap: wrap;
    color: white;
    gap: 20px;
    margin-top: 1%;

    .carre-container{
      width: 32%;
      padding: 1%;
      border-radius: 10px;
      display: flex;
      flex-direction: column;

      p{
        margin-top: 2%;
      }

      p:nth-of-type(2){
        text-decoration: underline;
        color: #2E303C;
      }

      .liste-matier{
        display: flex;
        flex-wrap: wrap;
        margin-top: 2%;

        div{
          border-radius: 100px;
          width: fit-content;
          margin-right: 5%;
          margin-bottom:  5%;
          padding: 5px;
          color: #2E303C;
          background-color: white;
          align-items: center;
          justify-content: center;
        }
      }

      input[type="button"]{
        width: 100%;
        padding: 2%;
        background-color: #2E303C;
        color: white;
        margin-top: auto;
        outline: none;
        border-radius: 15px;
      }
    }
  }
}

.section-mention{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
  color: white;
  background-color: #3693A5;

  .list-mention{
    display: flex;
    height: auto;
    min-height: 200px;
    justify-content: center;
    gap: 2%;
    margin-top: 2%;
    flex-wrap: wrap;

    .list-mention-item{
      width: 20%;
      min-width: 150px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .cercle-image{
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;

        img{
          width: 70%;
          height: 70%;
        }
      }
    }
  }

  /*------------------Responsive-------------------*/
  /*-
  @media screen and (max-width: 900px) {

  }
  */

  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    padding: 3%;

    .list-mention {
      gap: 3%;
      background-color: green;

      .list-mention-item {
        width: 45%;
        min-width: 120px;

        .cercle-image {
          width: 60px;
          height: 60px;
        }
      }
    }
  }

  /* Responsive pour mobiles */
  @media (max-width: 480px) {
    padding: 4%;
    
    .list-mention {
      flex-direction: column;
      align-items: center;
      gap: 20px;
      
      .list-mention-item {
        width: 80%;
        max-width: 200px;
        
        .cercle-image {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
}

@media (max-width: 900px) {

  .section-container{
    display: flex;
    flex-direction: column;
  }

  .partie-gauche{
    width: 100%;
    height: 70%;

    .text-container{
      font-size: medium;
    }
  }

  .partie-droite{
    width: 100%;
    height: 30%;

    img{
      width: 100%;
      height: 99%;
    }

  }

}


/* Lien d'administration discret */
.admin-link-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.admin-link {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(253, 75, 27, 0.5);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.admin-link:hover {
  background: var(--primary-color); /* Orange uni #FF5C31 */
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

</style>
