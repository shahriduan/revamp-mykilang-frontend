<template>
    <FullScreenSpinner />
</template>

<script setup>
import { axiosGetUserProfile } from '@/helpers/AxiosApiHelper'
import { usePermissionStore } from '@/stores/PermissionStore'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import FullScreenSpinner from '@/components/FullScreenSpinner.vue'
import ConstantConfig from '@/config/ConstantConfig'

const permissionStore = usePermissionStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
    axiosGetUserProfile((response) => {   
        permissionStore.keepPermissions(response.data.data.permissions)

        var userData = {
            fullname: response.data.data.fullname,
            username: response.data.data.username,
            email: response.data.data.email,
            user_type: response.data.data.user_type,
            company_id: response.data.data.company?.id,
        }

        authStore.storeUserProfile(userData)

        setTimeout(() => {
            if (userData.user_type == ConstantConfig.userType.hq) {
                router.replace({ name: 'backoffice:home' }) // Platform owner home page
            } else {
                router.replace({ name: 'console_home' }) // Client home page
            }
        }, 1000)
    })
})
</script>