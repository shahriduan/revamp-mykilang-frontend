<template>
    <main class="main" id="top">
        <div class="container-lg" data-layout="container">
            <BackofficeSideNavbar />
            <div class="content">
                <TopNavbar />
                <router-view />
                <BottomFooter />
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { axiosGetUserProfile } from '@/helpers/AxiosApiHelper'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/PermissionStore'
import { can } from '@/helpers/PermissionHelper'
import BackofficeSideNavbar from '@/layouts/console/BackofficeSideNavbar.vue'
import TopNavbar from '@/layouts/_shared/TopNavbar.vue'
import BottomFooter from '@/layouts/_shared/BottomFooter.vue'

const permissionStore = usePermissionStore()
const authStore = useAuthStore()

const full_name = ref('')
const username = ref('')

onBeforeMount(() => {
    axiosGetUserProfile((response) => {
        full_name.value = response.data.data.fullname
        username.value = response.data.data.username

        permissionStore.keepPermissions(response.data.data.permissions)
    })
})
</script>
