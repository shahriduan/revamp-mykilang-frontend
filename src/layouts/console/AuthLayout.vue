<template>
    <div style="height: 100vh">
        <div class="d-flex" style="min-height: 100%">
            <div class="wrapper-login-picture d-none d-xl-block login-background"></div>
            <div class="wrapper-login px-4 px-sm-5 my-auto mx-auto text-center">
                <div class="row">
                    <div class="col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3 col-xxl-4 offset-xxl-4">
                        <router-link :to="{ name: 'login' }" class="mx-auto text-center">
                            <img :src="AppConfig.systemLogo" class="system-logo" alt="logo" />
                        </router-link>
                        <div class="mb-4"></div>
                        <router-view />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AppConfig from '@/config/AppConfig'
</script>

<style lang="css" scoped>
@media screen and (max-width: 767px) {
    div.wrapper-login {
        width: 100%
    }
}
@media screen and (min-width: 768px) {
    div.wrapper-login-picture {
        width: 30%
    }
    div.wrapper-login {
        width: 70%
    }
}
.login-background {
    background-image: url('/img/backgrounds/industry-4.0.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto 100%;
}
.system-logo {
    width: 70%;
}
</style>