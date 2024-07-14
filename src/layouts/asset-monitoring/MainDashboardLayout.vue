<template>
    <!-- Falcon Top Nav Layout -->
    <main class="main" id="top">
        <div class="container" data-layout="container">
            <ASMTopNavbar />
            <div class="content">
                <div aria-details="Page content based on route name">
                    <router-view />
                </div>
                <BottomFooter />
            </div>
        </div>
    </main>
</template>

<script setup>
import BottomFooter from '@/layouts/_shared/BottomFooter.vue'
import ASMTopNavbar from '@/layouts/asset-monitoring/ASMTopNavbar.vue'
</script>
