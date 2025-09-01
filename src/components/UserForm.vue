<template>
  <!-- Modal de saisie nom/prénom -->
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="user-form-modal" @click.stop>
      <h2>Informations du candidat</h2>
      <p>Veuillez saisir vos informations avant de commencer l'évaluation</p>
      
      <form @submit.prevent="validateAndSubmit">
        <div class="form-group">
          <label for="nom">Nom :</label>
          <input 
            type="text" 
            id="nom" 
            v-model="localUserInfo.nom" 
            :class="{ 'error': formErrors.nom }"
            placeholder="Entrez votre nom"
            required
          >
          <span v-if="formErrors.nom" class="error-message">{{ formErrors.nom }}</span>
        </div>
        
        <div class="form-group">
          <label for="prenom">Prénom :</label>
          <input 
            type="text" 
            id="prenom" 
            v-model="localUserInfo.prenom" 
            :class="{ 'error': formErrors.prenom }"
            placeholder="Entrez votre prénom"
            required
          >
          <span v-if="formErrors.prenom" class="error-message">{{ formErrors.prenom }}</span>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="cancel-btn">Annuler</button>
          <button type="submit" class="validate-btn">Commencer le quiz</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userInfo: {
    type: Object,
    default: () => ({ nom: '', prenom: '' })
  },
  selectedClassName: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// État local
const localUserInfo = ref({ ...props.userInfo })
const formErrors = ref({ nom: '', prenom: '' })

// Watcher pour synchroniser les props
watch(() => props.userInfo, (newVal) => {
  localUserInfo.value = { ...newVal }
}, { deep: true })

// Validation des champs
const validateField = (field, value) => {
  if (!value.trim()) {
    return `Le ${field} est requis`
  }
  
  // Vérifier qu'il n'y a pas de chiffres
  if (/\d/.test(value)) {
    return `Le ${field} ne doit pas contenir de chiffres`
  }
  
  // Vérifier la longueur minimale
  if (value.trim().length < 2) {
    return `Le ${field} doit contenir au moins 2 caractères`
  }
  
  return ''
}

// Validation et soumission du formulaire
const validateAndSubmit = async () => {
  // Reset des erreurs
  formErrors.value = { nom: '', prenom: '' }
  
  // Validation
  const nomError = validateField('nom', localUserInfo.value.nom)
  const prenomError = validateField('prénom', localUserInfo.value.prenom)
  
  if (nomError) formErrors.value.nom = nomError
  if (prenomError) formErrors.value.prenom = prenomError
  
  // Si pas d'erreurs, vérifier si l'utilisateur a déjà participé
  if (!nomError && !prenomError) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const response = await fetch('/api/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: localUserInfo.value.nom.trim(),
          prenom: localUserInfo.value.prenom.trim(),
          classe: props.selectedClassName
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        
        if (result.exists) {
          // L'utilisateur a déjà participé
          alert(`❌ Désolé, ${localUserInfo.value.prenom} ${localUserInfo.value.nom} a déjà participé à cette évaluation pour cette classe.\n\n📞 Pour toute question, contactez l'administrateur au :\n+225 05 02 14 46 23`)
          return
        } else {
          // L'utilisateur peut participer
          emit('submit', {
            nom: localUserInfo.value.nom.trim(),
            prenom: localUserInfo.value.prenom.trim()
          })
        }
      } else {
        throw new Error('Erreur lors de la vérification')
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error)
      alert('❌ Erreur lors de la vérification. Veuillez réessayer.')
    }
  }
}
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal container */
.user-form-modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.user-form-modal h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.user-form-modal p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

/* Form styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* Form actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn, .validate-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

.validate-btn {
  background-color: #EA6F4EFF;
  color: white;
}

.validate-btn:hover {
  background-color: var(--accent-color);
}

/* Responsive */
@media (max-width: 768px) {
  .user-form-modal {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn, .validate-btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .user-form-modal {
    padding: 1rem;
    width: 95%;
  }
  
  .user-form-modal h2 {
    font-size: 1.3rem;
  }
  
  .form-group input {
    padding: 0.6rem;
  }
}
</style>
