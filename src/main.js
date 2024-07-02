import '@/assets/theme.css'
import '@/assets/app.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/web'

const app = createApp(App)

app.use(createPinia())
   .use(router)

app.mount('#app')
