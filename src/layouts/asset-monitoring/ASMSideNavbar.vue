<template>
    <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand-xl">
        <div class="collapse navbar-collapse d-flex" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <SidebarNavLink :is-active-nav="['asm:real_time'].includes($route.name)" :route-name="{ name: 'asm:real_time' }" title="Live" />
                <SidebarNavLink :is-active-nav="['asm:temperature'].includes($route.name)" :route-name="{ name: 'asm:temperature' }" title="Temperature" />
                <SidebarNavLink :is-active-nav="['asm:vibration'].includes($route.name)" :route-name="{ name: 'asm:vibration' }" title="Vibration" />
                <SidebarNavLink :is-active-nav="['asm:power_consumption'].includes($route.name)" :route-name="{ name: 'asm:power_consumption' }" title="Power" />
                <SidebarNavLink :is-active-nav="['asm:analysis'].includes($route.name)" :route-name="{ name: 'asm:analysis' }" title="Analysis" />
            </ul>
        </div>
    </nav>
</template>

<script setup>
import SidebarNavLink from '@/layouts/_shared/SidebarNavLink.vue'
</script>