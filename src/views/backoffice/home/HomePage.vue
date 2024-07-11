<template>
    <div class="row">
        <div class="col-md-4">
            <h3>Home</h3>
        </div>
    </div>
    <img :src="AppConfig.systemLogo" alt="MyKilang" class="img-fluid v-center">
</template>

<script setup>
import AppConfig from '@/config/AppConfig'
</script>

<style scoped>
.v-center {
    opacity: 0.3;  
    position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%);
}
</style>