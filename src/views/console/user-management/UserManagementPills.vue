<template>
    <router-link class="nav-link fw-bold mb-2 mt-1" :class="{ active: ['console_home'].includes($route.name) }" :to="{ name: 'console_home' }" role="button" v-if="userType !== 'HQ'">
        <div class="d-flex align-items-center">
            <span class="nav-link-icon">
                <span class="fa-solid fa-arrow-left"></span>
            </span>
            <span class="nav-link-text ps-1">BACK TO CONSOLE HOME</span>
        </div>
    </router-link>

    <ul class="nav nav-pills mb-3">
        <li class="nav-item">
            <router-link class="nav-link py-2" :class="{ active: ['console:user.index', 'console:user.form', 'console:user.delete_user', 'console:user.reset_password'].includes($route.name) }" :to="{ name: 'console:user.index' }" v-if="$can('user.list')">
                <i class="bi bi-people fa-lg me-2"></i> Users
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link py-2" :class="{ active: ['console:role.index', 'console:role.form'].includes($route.name) }" :to="{ name: 'console:role.index' }" v-if="$can('role.list')">
                <i class="bi bi-shield-shaded fa-lg me-2"></i> Roles and Permissions (Cloud Console)
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link py-2" :class="{ active: ['console:ot_role.index', 'console:ot_role.form'].includes($route.name) }" :to="{ name: 'console:ot_role.index' }" v-if="$can('role.list')">
                <i class="bi bi-shield-shaded fa-lg me-2"></i> Roles and Permissions (On-premise)
            </router-link>
        </li>
    </ul>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const userType = ref()

onMounted(() => {
    userType.value = authStore.userProfile.user_type
})
</script>
