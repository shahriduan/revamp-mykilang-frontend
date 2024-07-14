<template>
    <a class="navbar-brand me-1 me-sm-3" :href="$router.resolve({ name: 'console_home' }).href">
        <div class="d-flex align-items-center">
            <img :src="AppConfig.systemLogo" :width="AppConfig.systemLogoWidth" alt="Logo" />
        </div>
    </a>
</template>

<script setup>
import AppConfig from '@/config/AppConfig'
</script>
