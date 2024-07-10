<template>
    <main class="main" id="top">
        <div class="container-lg" data-layout="container">
            <MyCompanySideNavbar />
            <div class="content">
                <TopNavbar />
                <router-view />
                <BottomFooter />
            </div>
        </div>
    </main>
</template>

<script setup>
import MyCompanySideNavbar from '@/layouts/console/MyCompanySideNavbar.vue'
import TopNavbar from '@/layouts/_shared/TopNavbar.vue'
import BottomFooter from '@/layouts/_shared/BottomFooter.vue'
</script>