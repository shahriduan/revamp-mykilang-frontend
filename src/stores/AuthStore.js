import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ConstantConfig from '@/config/ConstantConfig'
import { AES, enc } from 'crypto-js'

export const useAuthStore = defineStore('authStore', () => {
    const key = ConstantConfig.localStorageKey

    var token = ref(localStorage.getItem(key.token))

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
        localStorage.clear()
        token.value = localStorage.getItem(key.token)
    }

    // Data about user for client user
    function storeUserProfile(data) {
        var encryptUserProfile = AES.encrypt(JSON.stringify(data), 'VISI@MyKilang').toString();
        localStorage.setItem(key.userProfile, encryptUserProfile)
    }  

    return {
        token,
        userProfile,
        storeAuth,
        removeAuth,
        storeUserProfile
    }
})