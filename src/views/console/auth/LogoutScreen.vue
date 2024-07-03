<template>
    <div class="loading-wrapper d-flex">
        <div class="loader-container text-center">
            <img :src="AppConfig.systemLogo" alt="MyKilang" width="200" class="mb-3">
            <div class="text-muted mb-3">Signing Out</div>
            <div class="progress-bar">
                <div class="progress-bar-value"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import { onMounted } from 'vue'
import apiRoute from '@/helpers/ApiHelper'
import AppConfig from '@/config/AppConfig'

const authStore = useAuthStore()

onMounted(async () => {
    await window.axios.post(apiRoute({ name: 'api:logout' }), {
            current_domain: AppConfig.domain
        })
        .then((response) => {
            authStore.removeAuth()

            setTimeout(() => {
                if (response.data.data.next_logout_domain == null) {
                    window.location.href = AppConfig.domain
                } else {
                    window.location.href = response.data.data.next_logout_domain + AppConfig.logoutUrl
                }
            }, 500)
        })
})
</script>

<style scoped>
.loading-wrapper {
    height: 100vh;
}
.loader-container {
    width: 300px;
    margin: auto;
}
.progress-bar {
    height: 5px;
    background-color: rgba(5, 114, 206, 0.2);
    width: 100%;
    overflow: hidden;
}
.progress-bar-value {
    width: 100%;
    height: 100%;
    background-color: var(--falcon-primary);
    animation: indeterminateAnimation 1.2s infinite linear;
    transform-origin: 0% 50%;
}
@keyframes indeterminateAnimation {
    0% {
        transform:  translateX(0) scaleX(0);
    }
    40% {
        transform:  translateX(0) scaleX(0.4);
    }
    100% {
        transform:  translateX(100%) scaleX(0.5);
    }
}
</style>