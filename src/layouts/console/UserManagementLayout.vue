<template>
    <ConsoleHomeLayout v-if="authStore.userProfile.user_type == ConstantConfig.userType.client">
        <div class="mb-3">
            <router-link :to="{ name: 'console_home' }" class="fw-semi-bold text-secondary fs-0" style="text-decoration: none">
                <span class="fa-solid fa-arrow-left me-2"></span> BACK TO CONSOLE HOME
            </router-link>
        </div>
        <router-view />
    </ConsoleHomeLayout>
    <AppLayout v-if="authStore.userProfile.user_type == ConstantConfig.userType.hq">
        <router-view />
    </AppLayout>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import ConsoleHomeLayout from '@/layouts/console/ConsoleHomeLayout.vue'
import AppLayout from '@/layouts/console/BackofficeLayout.vue'
import ConstantConfig from '@/config/ConstantConfig'

const authStore = useAuthStore()
</script>