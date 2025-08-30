import { createApp } from 'vue'
import App from './App.vue'
// style appliquer a toute les page
import './style.css'

const app = createApp(App)

// Désactiver les avertissements de production en mode production
if (process.env.NODE_ENV === 'production') {
  app.config.devtools = false
  app.config.performance = false
  app.config.warnHandler = () => {}
}

app.mount('#app')
