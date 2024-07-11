<template>
    <FullScreenSpinner />
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import FullScreenSpinner from '@/components/FullScreenSpinner.vue'

const authStore = useAuthStore()
const router = useRouter()
const currentRoute = useRoute()

onMounted(() => {
    // Socialite auth. Store token in local storage
    authStore.storeAuth(currentRoute.query.token)
    
    setTimeout(() => {
        router.replace({ name: 'console:system_start' })
    }, 1000);
})
</script>