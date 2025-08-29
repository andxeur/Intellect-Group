<template>
  <footer class="modern-footer">
    <!-- Section principale du footer -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Section Brand -->
        <div class="footer-brand">
          <div class="brand-logo">
            <img src="../assets/image/logo.png" alt="Intellect-Group Logo" class="logo-img">
            <div class="brand-info">
              <h3 class="brand-name">Intellect-Group</h3>
              <p class="brand-slogan">L'excellence à tout prix</p>
            </div>
          </div>
          <p class="brand-description">
            Votre partenaire de confiance pour l'évaluation et l'excellence académique. 
            Nous accompagnons les élèves vers la réussite avec des outils pédagogiques innovants.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Section Navigation -->
        <div class="footer-section">
          <h4 class="section-title">Navigation</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Accueil</a></li>
            <li><a href="#quiz-section" class="footer-link">Évaluations</a></li>
            <li><a href="#" class="footer-link">À propos</a></li>
            <li><a href="#" class="footer-link">Contact</a></li>
          </ul>
        </div>

        <!-- Section Niveaux -->
        <div class="footer-section">
          <h4 class="section-title">Niveaux</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Primaire (CE2-CM2)</a></li>
            <li><a href="#" class="footer-link">Collège (6ème-3ème)</a></li>
            <li><a href="#" class="footer-link">Lycée (A1, A2, D)</a></li>
          </ul>
        </div>

        <!-- Section Contact -->
        <div class="footer-section">
          <h4 class="section-title">Contact</h4>
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">
                <img src="../assets/image/phone.svg" alt="Téléphone">
              </div>
              <div class="contact-details">
                <span class="contact-label">Téléphone</span>
                <span class="contact-value">+225 05 02 14 46 23</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <img src="../assets/image/Location.svg" alt="Localisation">
              </div>
              <div class="contact-details">
                <span class="contact-label">Adresse</span>
                <span class="contact-value">Marcory, Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Copyright -->
    <div class="footer-bottom">
      <div class="footer-container">
        <div class="copyright-content">
          <p class="copyright-text">
            © 2025 Intellect-Group. Tous droits réservés.
          </p>
          <div class="footer-bottom-links">
            <a href="#" class="bottom-link">Politique de confidentialité</a>
            <a href="#" class="bottom-link">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style scoped>
/* ===============================================
   MODERN FOOTER STYLES
   =============================================== */

/* Variables CSS */
:root {
  --footer-bg: #2E303C;
  --footer-text: #ffffff;
  --footer-text-light: #a0aec0;
  --footer-accent: #FF5C31;
  --footer-secondary: #3693A5;
  --footer-border: rgba(255, 255, 255, 0.1);
  --footer-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Footer Principal */
.modern-footer {
  background: var(--footer-bg);
  color: var(--footer-text);
  box-shadow: var(--footer-shadow);
  margin-top: auto;
}

.footer-main {
  padding: 4rem 0 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
}

/* Section Brand */
.footer-brand {
  max-width: 350px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  /*color: var(--footer-accent);  #FF5C31 */
  color: var(--accent-color) ;
  margin: 0 0 0.25rem 0;
}

.brand-slogan {
  font-size: 0.9rem;
  color: #3693A5;
  margin: 0;
  font-weight: 500;
}

.brand-description {
  color: var(--footer-text-light);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

/* Liens Sociaux */
.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--footer-text-light);
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: var(--footer-accent); /* #FF5C31 */
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 92, 49, 0.3);
}

.social-link svg {
  width: 18px;
  height: 18px;
}

/* Sections Footer */
.footer-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--footer-text);
  margin-bottom: 1.5rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--footer-accent); /* Orange uni #FF5C31 */
  border-radius: 1px;
}

/* Liens Footer */
.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: var(--footer-text-light);
  text-decoration: none;
  font-size: 0.95rem;
  transition: var(--transition);
  display: inline-block;
}

.footer-link:hover {
  color: var(--footer-accent);
  transform: translateX(5px);
}

/* Section Contact */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  width: 40px;
  height: 40px;
  background-color: #3693A5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon img {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-label {
  font-size: 0.8rem;
  color: var(--footer-text-light);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  color: var(--footer-text);
  font-size: 0.95rem;
  font-weight: 500;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid var(--footer-border);
  padding: 1.5rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.copyright-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright-text {
  color: var(--footer-text-light);
  font-size: 0.9rem;
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  gap: 2rem;
}

.bottom-link {
  color: var(--footer-text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}

.bottom-link:hover {
  color: var(--footer-accent);
}

/* ===============================================
   RESPONSIVE DESIGN
   =============================================== */

/* Tablettes */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
  
  .footer-brand {
    max-width: none;
  }
}

/* Tablettes Portrait */
@media (max-width: 768px) {
  .footer-main {
    padding: 3rem 0 1.5rem;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1.5rem;
  }
  
  .brand-logo {
    justify-content: center;
    text-align: center;
  }
  
  .brand-description {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .copyright-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-bottom-links {
    justify-content: center;
  }
}

/* Mobiles */
@media (max-width: 480px) {
  .footer-main {
    padding: 2rem 0 1rem;
  }
  
  .footer-container {
    padding: 0 1rem;
    gap: 1.5rem;
  }
  
  .brand-name {
    font-size: 1.3rem;
  }
  
  .brand-description {
    font-size: 0.9rem;
  }
  
  .footer-bottom-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .contact-item {
    gap: 0.75rem;
  }
  
  .contact-icon {
    width: 36px;
    height: 36px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-section {
  animation: fadeInUp 0.6s ease-out;
}

.footer-brand {
  animation: fadeInUp 0.6s ease-out 0.1s both;
}
</style>
