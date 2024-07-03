import '@/assets/theme.css'
import '@/assets/app.css'
import '@/bootstrap'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { can } from '@/helpers/PermissionHelper'
import router from '@/router/web'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import BackButton from '@/components/BackButton.vue'
import ContentHeader from '@/components/ContentHeader.vue'
import Asterisk from '@/components/Asterisk.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
/**
 * Global custom component must start with 'x'. 
 * Example: XPageTitle or x-page-title
 */
app.component('XBackButton', BackButton)
app.component('XContentHeader', ContentHeader)
app.component('XAsterisk', Asterisk)
app.config.globalProperties.$can = can

app.mount('#app')
