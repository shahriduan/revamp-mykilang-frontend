<template>
    <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">
        <div class="d-flex align-items-center">
            <div class="toggle-icon-wrapper">
                <button class="btn navbar-toggler-humburger-icon navbar-vertical-toggle" data-bs-toggle="tooltip" data-bs-placement="left" title="Toggle Navigation">
                    <span class="navbar-toggle-icon">
                        <span class="toggle-line"></span>
                    </span>
                </button>
            </div>
            <a class="navbar-brand" href="/">
                <div class="d-flex align-items-center py-3">
                    <img :src="AppConfig.systemLogo" :width="AppConfig.systemLogoWidth" alt="Logo" />
                </div>
            </a>
        </div>
        <div class="collapse navbar-collapse" id="navbarVerticalCollapse">
            <div class="navbar-vertical-content scrollbar">
                <ul class="navbar-nav flex-column mb-3" id="navbarVerticalNav">
                    <li class="nav-item">
                        <router-link class="nav-link sidebar-menu" :class="{ active: ['backoffice:home'].includes($route.name) }" :to="{ name: 'backoffice:home' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fas fa-home"></span>
                                </span>
                                <span class="nav-link-text ps-1">Home</span>
                            </div>
                        </router-link>
                        <router-link class="nav-link sidebar-menu" :class="{ active: ['console:client_account.index', 'console:client_account.form', 'console:client_account.license_key.index', 'console:client_account.license_key.form'].includes($route.name) }" :to="{ name: 'console:client_account.index' }" role="button" v-if="$can('client_account.list')">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-building" style="margin-left: 3px"></span>
                                </span>
                                <span class="nav-link-text ps-1">Client Accounts</span>
                            </div>
                        </router-link>
                        <router-link class="nav-link sidebar-menu" :class="{ active: ['console:user.index', 'console:role.index', 'console:role.form', 'console:ot_role.index', 'console:ot_role.form', 'console:user.form', 'console:user.delete_user', 'console:user.reset_password'].includes($route.name) }" :to="$can('user.list') ? { name: 'console:user.index' } : { name: 'console:role.index' }" role="button" v-if="$can(['user.list', 'role.list'])">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fas fa-users"></span>
                                </span>
                                <span class="nav-link-text ps-1">User Management</span>
                            </div>
                        </router-link>
                        <router-link class="nav-link sidebar-menu" :class="{ active: ['console:package.list'].includes($route.name) }" :to="{ name: 'console:package.list' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-box"></span>
                                </span>
                                <span class="nav-link-text ps-1">Packages</span>
                            </div>
                        </router-link>
                        <router-link v-if="AppConfig.appEnv !== 'production'" class="nav-link sidebar-menu" :class="{ active: ['console:access_client_module.list'].includes($route.name) }" :to="{ name: 'console:access_client_module.list' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="bi bi-person-workspace"></span>
                                </span>
                                <span class="nav-link-text ps-1">Access Client Module</span>
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <div class="row navbar-vertical-label-wrapper mt-3 mb-2" v-if="$can(['platform_settings.manage_module_configuration'])">
                            <div class="col-auto navbar-vertical-label">Platform Settings</div>
                            <div class="col ps-0">
                                <hr class="mb-0 navbar-vertical-divider" />
                            </div>
                        </div>
                        <router-link class="nav-link sidebar-menu" :to="{ name: 'console:system_module.index' }" :class="{ active: ['console:system_module.index', 'console:system_module.config'].includes($route.name) }" role="button" v-if="$can('platform_settings.manage_module_configuration')">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-code"></span>
                                </span>
                                <span class="nav-link-text ps-1">Module Configuration</span>
                            </div>
                        </router-link>
                        <router-link class="nav-link sidebar-menu" :to="{ name: 'console:software.index' }" :class="{ active: ['console:software.index', 'console:software.form'].includes($route.name) }" role="button" v-if="$can('platform_settings.manage_software_version')">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-desktop"></span>
                                </span>
                                <span class="nav-link-text ps-1">Softwares</span>
                            </div>
                        </router-link>
                        <a class="nav-link" :href="AppConfig.consoleDomain + '/developer-logs?t=' + authStore.token" role="button" v-if="authStore.userProfile.username == 'admin'">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-bug"></span>
                                </span>
                                <span class="nav-link-text ps-1">Error Logs</span>
                            </div>
                        </a>
                        <router-link class="nav-link sidebar-menu" :to="{ name: 'console:global_setting.index' }" :class="{ active: ['console:global_setting.index'].includes($route.name) }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="bi bi-globe"></span>
                                </span>
                                <span class="nav-link-text ps-1">Global Setting</span>
                            </div>
                        </router-link>
                        <router-link class="nav-link sidebar-menu" :to="{ name: 'console:user_session.active_sessions' }" :class="{ active: ['console:user_session.active_sessions'].includes($route.name) }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="bi bi-person-lines-fill"></span>
                                </span>
                                <span class="nav-link-text ps-1">User Session</span>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import AppConfig from '@/config/AppConfig'

const authStore = useAuthStore()

onMounted(() => {
    var sidebarmenu = document.getElementsByClassName('sidebar-menu')
    Array.from(sidebarmenu).forEach(function(element) {
        element.addEventListener("click", closeNavbarForSmallDevice)
    })
})

function closeNavbarForSmallDevice() {
    var sidebar = document.getElementById('navbarVerticalCollapse')
    sidebar.classList.remove("show")
}
</script>
