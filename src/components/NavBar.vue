<template>
  <nav class="modern-navbar">
    <div class="navbar-container">
      <!-- Logo et Brand -->
      <div class="brand-section">
        <div class="logo-wrapper">
          <img src="../assets/image/logo.png" alt="Intellect-Group Logo" class="logo-image">
        </div>
        <div class="brand-text">
          <h1 class="brand-title">Intellect-Group</h1>
          <p class="brand-tagline">L'excellence à tout prix</p>
        </div>
      </div>

      <!-- Menu Desktop -->
      <div class="desktop-menu">
        <ul class="nav-links">
          <li><a href="#" class="nav-link active">Accueil</a></li>
          <li><a href="#quiz-section" class="nav-link">Évaluations</a></li>
          <li><a href="#" class="nav-link">À propos</a></li>
          <li><a href="#" class="nav-link">Contact</a></li>
        </ul>
        
        <div class="contact-info">
          <div class="phone-wrapper">
            <div class="phone-icon">
              <img src="../assets/image/phone.svg" alt="Téléphone">
            </div>
            <span class="phone-number">+225 05 02 14 46 23</span>
          </div>
        </div>
      </div>

      <!-- Menu Mobile Toggle -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Menu Mobile -->
    <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <ul class="mobile-nav-links">
          <li><a href="#" class="mobile-nav-link" @click="closeMobileMenu">Accueil</a></li>
          <li><a href="#quiz-section" class="mobile-nav-link" @click="closeMobileMenu">Évaluations</a></li>
          <li><a href="#" class="mobile-nav-link" @click="closeMobileMenu">À propos</a></li>
          <li><a href="#" class="mobile-nav-link" @click="closeMobileMenu">Contact</a></li>
        </ul>
        
        <div class="mobile-contact">
          <div class="mobile-phone">
            <img src="../assets/image/phone.svg" alt="Téléphone">
            <span>+225 05 02 14 46 23</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

// État du menu mobile
const isMobileMenuOpen = ref(false)

// Fonctions pour gérer le menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fermer le menu mobile si on clique en dehors
const handleClickOutside = (event) => {
  if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
    closeMobileMenu()
  }
}

// Écouter les clics en dehors du menu mobile
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<style scoped>
/* ===============================================
   MODERN NAVBAR STYLES
   =============================================== */

/* Variables CSS */
:root {
  --navbar-height: 80px;
  --primary-color: #FF5C31;
  --secondary-color: #3693A5;
  --accent-color: #ea6f4e;
  --text-dark: #2E303C;
  --text-light: #718096;
  --white: #ffffff;
  --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 10px 25px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Navbar Principal */
.modern-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-light);
  z-index: 1000;
  transition: var(--transition);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Section Brand/Logo */
.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color); /* #FF5C31 */
  margin: 0;
  line-height: 1.2;
}

.brand-tagline {
  font-size: 0.8rem;
  color: var(--secondary-color); /* #3693A5 */
  margin: 0;
  font-weight: 500;
}

/* Menu Desktop */
.desktop-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  position: relative;
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  transition: var(--transition);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Contact Info */
.contact-info {
  display: flex;
  align-items: center;
}

.phone-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
}

.phone-wrapper:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.phone-icon {
  width: 16px;
  height: 16px;
}

.phone-icon img {
  width: 100%;
  height: 100%;
  filter: brightness(0) invert(1);
}

.phone-number {
  white-space: nowrap;
}

/* Menu Mobile Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: var(--transition);
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--text-dark);
  margin: 2px 0;
  transition: var(--transition);
  transform-origin: center;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Menu Mobile */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--white);
  box-shadow: var(--shadow-medium);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-menu-content {
  padding: 2rem;
}

.mobile-nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-links li {
  margin-bottom: 1rem;
}

.mobile-nav-link {
  display: block;
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.mobile-nav-link:hover {
  color: var(--primary-color);
  padding-left: 1rem;
}

.mobile-contact {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-phone {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--primary-color); /* Orange uni #FF5C31 */
  color: var(--white);
  padding: 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
}

.mobile-phone img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

/* ===============================================
   RESPONSIVE DESIGN
   =============================================== */

/* Tablettes */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 0 1.5rem;
  }
  
  .nav-links {
    gap: 1.5rem;
  }
}

/* Tablettes Portrait */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .brand-title {
    font-size: 1.3rem;
  }
  
  .brand-tagline {
    font-size: 0.75rem;
  }
}

/* Mobiles */
@media (max-width: 480px) {
  .navbar-container {
    padding: 0 1rem;
  }
  
  .logo-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .brand-title {
    font-size: 1.1rem;
  }
  
  .brand-tagline {
    font-size: 0.7rem;
  }
  
  .mobile-menu-content {
    padding: 1.5rem;
  }
}

/* Effet de scroll sur la navbar */
.modern-navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-medium);
}
</style>
