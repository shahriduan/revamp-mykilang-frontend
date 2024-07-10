<template>
    <ConsoleHomeLayout v-if="authStore.userProfile.user_type == ConstantConfig.userType.client">
        <router-view />
    </ConsoleHomeLayout>
    <BackofficeLayout v-if="authStore.userProfile.user_type == ConstantConfig.userType.hq">
        <router-view />
    </BackofficeLayout>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import ConsoleHomeLayout from '@/layouts/console/ConsoleHomeLayout.vue'
import BackofficeLayout from '@/layouts/console/BackofficeLayout.vue'
import ConstantConfig from '@/config/ConstantConfig'

const authStore = useAuthStore()
</script>