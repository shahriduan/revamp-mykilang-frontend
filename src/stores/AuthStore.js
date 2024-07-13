import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AES, enc } from 'crypto-js'
import ConstantConfig from '@/config/ConstantConfig'

export const useAuthStore = defineStore('authStore', () => {
    const key = ConstantConfig.localStorageKey

    var token = ref(localStorage.getItem(key.token))

    /**
     * Current module code
     */
    var currentModule = ref(localStorage.getItem(key.currentModule))

    /**
     * Data about user profile
     * 
     * Data store inside this variable: fullname, username, email, user_type, company_id
     */
    var userProfile = computed(() => {
        var local2 = localStorage.getItem(key.userProfile)
        return JSON.parse(AES.decrypt(local2, 'VISI@MyKilang').toString(enc.Utf8));
    })

    function storeAuth(apiToken) {
        localStorage.setItem(key.token, apiToken)
        token.value = apiToken
    }

    function removeAuth() {
        for (var i = 0; i < localStorage.length; i++) {
            // Clear local storage except theme
            if (localStorage.key(i) == key.theme) {
                continue
            }
            localStorage.removeItem(localStorage.key(i))
        }

        token.value = localStorage.getItem(key.token)
    }

    /**
     * Store data about user profile
     */
    function storeUserProfile(data) {
        var encryptUserProfile = AES.encrypt(JSON.stringify(data), 'VISI@MyKilang').toString();
        localStorage.setItem(key.userProfile, encryptUserProfile)
    }  

    function storeCurrentModule(moduleCode) {
        currentModule.value = moduleCode
        localStorage.setItem(key.currentModule, moduleCode)
    }

    return {
        token,
        currentModule,
        userProfile,
        storeAuth,
        removeAuth,
        storeUserProfile,
        storeCurrentModule
    }
})