<template>
    <div v-if="$route.query.status == 'ok'">
        <div style="height: 100vh" class="text-center mt-5">
            <img src="/img/icons/mail-check.png" alt="Logo" width="250">
            <h3 class="fw-bold">Thank You!</h3>
            <p>Your email address is now verified.</p>
            <div>Redirecting ...</div>
            <div class="dots" style="margin: auto"></div>          
        </div>
    </div>
    <div v-else>
        The email verification link has expired. You can close this browser tab.  
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const currentRoute = useRoute()

onMounted(() => {
    if (currentRoute.query.status == 'ok') {
        setTimeout(() => {
            router.replace({ name: 'console:account.change_email' })
        }, 1500);
    }
})

</script>

<style lang="css" scoped>
    .dots {
        width: 50px;
        aspect-ratio: 4;
        --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
        background: var(--_g) 0%   50%, var(--_g) 50%  50%, var(--_g) 100% 50%;
        background-size: calc(100%/3) 100%;
        animation: d7 1s infinite linear;
    }
    @keyframes d7 {
        33%{background-size:calc(100%/3) 0%  ,calc(100%/3) 100%,calc(100%/3) 100%}
        50%{background-size:calc(100%/3) 100%,calc(100%/3) 0%  ,calc(100%/3) 100%}
        66%{background-size:calc(100%/3) 100%,calc(100%/3) 100%,calc(100%/3) 0%  }
    }
</style>