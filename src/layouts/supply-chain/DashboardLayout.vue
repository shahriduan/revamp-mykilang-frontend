<template>
    <!-- Falcon Navbar Vertical Layout -->
    <main class="main" id="top">
        <div class="container" data-layout="container">
            <SupplyChainSideNavbar />
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
import TopNavbar from '@/layouts/_shared/TopNavbar.vue'
import BottomFooter from '@/layouts/_shared/BottomFooter.vue'
import SupplyChainSideNavbar from '@/layouts/supply-chain/SupplyChainSideNavbar.vue'
</script>
