<template>
    <!-- Falcon Navbar Vertical Layout -->
    <main class="main" id="top">
        <div class="container" data-layout="container">
            <OEESideNavbar />
            <div class="content">
                <TopNavbar />
                <div aria-details="Page content based on route name">
                    <router-view />
                </div>
                <BottomFooter />
            </div>
        </div>
    </main>
</template>

<script setup>
import OEESideNavbar from '@/layouts/oee/OEESideNavbar.vue'
import TopNavbar from '@/layouts/_shared/TopNavbar.vue'
import BottomFooter from '@/layouts/_shared/BottomFooter.vue'
</script>