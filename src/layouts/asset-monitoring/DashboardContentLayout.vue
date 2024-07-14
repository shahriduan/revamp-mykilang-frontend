<template>
    <h4>Dashboard</h4>
    <ul class="nav nav-tabs mb-2" id="myTab" role="tablist">
        <li class="nav-item" v-for="navItem in navItems">
            <router-link :class="{ 'nav-link': true, active: navItem.isActive.includes($route.name) }" :to="{ name: navItem.routeName }">
                {{ navItem.title }}
                <i class="fa-solid fa-circle fa-sm text-danger ms-1" v-if="navItem.haveCircleIcon"></i>
            </router-link>
        </li>
    </ul>
    <router-view />
</template>

<script setup>
const navItems = [
    { title: 'Live', routeName: 'asm:realtime', isActive: ['asm:realtime'], haveCircleIcon: true },
    { title: 'Monitoring', routeName: 'asm:temperature', isActive: ['asm:temperature', 'asm:vibration', 'asm:power_consumption'], haveCircleIcon: false },
    { title: 'Analysis', routeName: 'asm:analysis', isActive: ['asm:analysis'], haveCircleIcon: false }
]
</script>
