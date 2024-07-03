import { defineStore } from 'pinia'
import { ref } from 'vue'
import ConstantConfig from '@/config/ConstantConfig'

export const usePermissionStore = defineStore(ConstantConfig.localStorageKey.permissionStore, () => {
    var json = JSON.parse(localStorage.getItem(ConstantConfig.localStorageKey.permissionStore))
    
    const permissions = ref(json?.permissions)

    function keepPermissions(permissionArray) {
        permissions.value = permissionArray
    }

    return {
        keepPermissions,
        permissions
    }
}, {
    persist: true
})