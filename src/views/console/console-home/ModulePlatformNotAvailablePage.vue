<template>
    <div class="card h-100">
        <div class="card-body p-4 p-sm-5">
            <div class="text-center">
                <img class="d-block mx-auto mb-4" src="/img/illustrations/desktop-dashboard.png" alt="shield" width="200">
                <h4>We are sorry... <i class="fas fa-sad-tear"></i></h4>
                <p>The {{ $route.query.module }} Module is not available on a Web platform. We will create something awesome in the future.</p>
                
                <router-link class="btn btn-primary btn-sm mt-3" :to="{ name: 'console_home' }">
                    <i class="fas fa-arrow-left me-1"></i> Return to Console Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>
