<template>
    <FullScreenSpinner />
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import FullScreenSpinner from '@/components/FullScreenSpinner.vue'
import ConstantConfig from '@/config/ConstantConfig'

const authStore = useAuthStore()
const router = useRouter()
const currentRoute = useRoute()

/**
 * QueryParam   module          required all time
 */
onMounted(() => {
    authStore.storeCurrentModule(currentRoute.query.module) // Set current module

    setTimeout(() => {
        if (currentRoute.query.module == ConstantConfig.moduleCode.oee) {
            router.replace({ name: 'oee.dashboard' })
        } else if (currentRoute.query.module == ConstantConfig.moduleCode.spc) {
            router.replace({ name: 'apiw.dashboard' })
        } else {
            router.replace({ name: 'not_found' })
        }
    }, 1000)
})
</script>