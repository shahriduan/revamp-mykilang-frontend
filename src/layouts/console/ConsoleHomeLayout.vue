<template>
    <main class="main" id="top">
        <div class="container-lg" data-layout="container">
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
import { axiosGetUserProfile } from '@/helpers/AxiosApiHelper'
import { usePermissionStore } from '@/stores/PermissionStore'
import { can } from '@/helpers/PermissionHelper'
import TopNavbar from '@/layouts/_shared/TopNavbar.vue'
import BottomFooter from '@/layouts/_shared/BottomFooter.vue'

const permissionStore = usePermissionStore()

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