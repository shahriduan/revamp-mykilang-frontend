<template>
    <div class="mb-3">
        <x-content-header title="Access Client Module" />
    </div>

    <div class="row g-3 mb-4">
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3" v-for="clientModule in moduleData" :key="clientModule.id">
            <AccesClientModuleWidget 
                :module-name="clientModule.module_name" 
                @click="moduleClick(clientModule, clientModule.web_app_access, clientModule.code, AppConfig.moduleDomain)"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import AppConfig from '@/config/AppConfig'
import apiRoute from '@/helpers/ApiHelper'
import AccesClientModuleWidget from '@/views/backoffice/client-module-access/AccesClientModuleWidget.vue'
import ConstantConfig from '@/config/ConstantConfig'

const router = useRouter()
const authStore = useAuthStore()
const moduleData = ref([])

onMounted(async() => {
    await getModules()
})

async function getModules() {
    await window.axios.get(apiRoute({ name: 'api:platform_module.module_list' }))
        .then(function (response) {
            moduleData.value = response.data.data
        })
        .catch(function (error) {
            snackbar('Error on retrieving data!')
        })
}

function moduleClick(clientModule, haveWebAppAccess, moduleCode, moduleDomain) {
    // Pass local storage data to module
    var user_profile = localStorage.getItem(ConstantConfig.localStorageKey.userProfile)
    var token = authStore.token
    var theme = localStorage.getItem(ConstantConfig.localStorageKey.theme)

    if (haveWebAppAccess) {
        const auth_url = moduleDomain + clientModule.main_landing_url + '?module=' + moduleCode + '&token=' + token + '&theme=' + theme + '&userProfile=' + user_profile
        window.location.href = auth_url // Redirect to the module domain
    }    
}
</script>