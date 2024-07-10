<template>
    <ul class="nav nav-tabs mb-3">
        <li class="nav-item me-3">
            <router-link class="nav-link py-2" :class="{ active: 'working-days'.includes($route.name) }" :to="{ name: 'working-days' }">
                <i class="bi bi-calendar4-range fa-lg me-2"></i> Working Days
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link py-2" :class="{ active: 'holidays'.includes($route.name) }" :to="{ name: 'holidays' }">
                <i class="bi bi-calendar3 fa-lg me-2"></i> Holidays
            </router-link>
        </li>
    </ul>
</template>

<script setup>

</script>