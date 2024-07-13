<template>
    <li class="nav-item dropdown px-1 fontawesome-i2svg-active">
        <a class="nav-link fa-icon-wait nine-dots p-1" id="navbar-dropdown-module-list" role="button" data-hide-on-body-scroll="data-hide-on-body-scroll" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="43" viewBox="0 0 16 16" fill="none">
                <circle cx="2" cy="2" r="2" fill="#6C6E71"></circle>
                <circle cx="2" cy="8" r="2" fill="#6C6E71"></circle>
                <circle cx="2" cy="14" r="2" fill="#6C6E71"></circle>
                <circle cx="8" cy="8" r="2" fill="#6C6E71"></circle>
                <circle cx="8" cy="14" r="2" fill="#6C6E71"></circle>
                <circle cx="14" cy="8" r="2" fill="#6C6E71"></circle>
                <circle cx="14" cy="14" r="2" fill="#6C6E71"></circle>
                <circle cx="8" cy="2" r="2" fill="#6C6E71"></circle>
                <circle cx="14" cy="2" r="2" fill="#6C6E71"></circle>
            </svg>
        </a>
        <div class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end dropdown-menu-card dropdown-caret-bg" aria-labelledby="navbar-dropdown-module-list">
            <div class="card shadow-none">
                <div class="scrollbar-overlay nine-dots-dropdown" style="height: 13.5rem">
                    <div class="card-body px-3">
                        <div class="row text-center gx-0 gy-0">
                            <div class="col-12">
                                <a class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" href="/">
                                    <img class="rounded" src="/img/icons/mykilang-256x256.ico" alt="" width="40" height="40">
                                    <p class="mb-0 fw-medium text-800 text-truncate fs--2">Console Home</p>
                                </a>
                            </div>
                            <div :class="{ 'col-6': subscribedModules.length > 1, 'col-12': subscribedModules.length == 1 }" v-for="subscribeModule in subscribedModules">
                                <router-link class="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none" :to="{ name: 'console:start_module', query: { module: subscribeModule.code } }">
                                    <div class="avatar avatar-2xl">
                                        <div class="avatar-name rounded-circle bg-primary-subtle text-primary">
                                            <span class="fs-2">{{ subscribeModule.module_name.charAt(0) }}</span>
                                        </div>
                                    </div>
                                    <p class="mb-0 fw-medium text-800 text-truncate fs--2">{{ subscribeModule.module_name }}</p>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import apiRoute from '@/helpers/ApiHelper'

const authStore = useAuthStore()

const subscribedModules = ref()

onMounted(() => {
    getSubscribedModules()
})

function getSubscribedModules() {
    setTimeout(() => {
        window.axios.get(apiRoute({ name: 'api:company.subscribed_module', params: { company: authStore.userProfile.company_id } }))
            .then(response => {
                subscribedModules.value = response.data.data
            })
            .catch(error => {
                getSubscribedModules()
            })
    }, 1500)
}
</script>
