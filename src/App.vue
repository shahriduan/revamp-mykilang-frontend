<template>
    <component :is="$route.meta.layout || 'div'">
        <div v-if="$route.meta.permission == undefined || $can($route.meta.permission)">
            <router-view></router-view>
        </div>
        <div style="margin-top: 200px" v-else>
            <Forbidden />
        </div>
    </component>
</template>

<script setup>
import Forbidden from '@/components/Forbidden.vue'
</script>