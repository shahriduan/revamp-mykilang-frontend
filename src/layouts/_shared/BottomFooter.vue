<template>
    <footer class="footer">
        <div class="row g-0 justify-content-between fs--1 mt-4 mb-3">
            <div class="col-12 col-sm-auto text-center">
                <p class="mb-0 text-600">&copy; 2024 <a href="#!">{{ AppConfig.appName }}</a></p>
            </div>
            <div class="col-12 col-sm-auto text-center">
                <p class="mb-0 text-600">v{{ AppConfig.appVersion }}</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import AppConfig from '@/config/AppConfig'
</script>
