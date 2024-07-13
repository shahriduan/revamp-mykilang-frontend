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
                        <router-link class="nav-link sidebar-menu" :class="{ active: ['console_home'].includes($route.name) }" :to="{ name: 'console_home' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-arrow-left"></span>
                                </span>
                                <span class="nav-link-text ps-1">BACK TO CONSOLE HOME</span>
                            </div>
                        </router-link>
                        <router-link class="nav-link sidebar-menu" :class="{ active: ['console:my_company', 'console:subsidiary.form'].includes($route.name) }" :to="{ name: 'console:my_company' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-building"></span>
                                </span>
                                <span class="nav-link-text ps-1">Company</span>
                            </div>
                        </router-link>

                        <router-link class="nav-link sidebar-menu" :class="{ active: ['console:factory.list', 'console:factory.form'].includes($route.name) }" :to="{ name: 'console:factory.list' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-industry"></span>
                                </span>
                                <span class="nav-link-text ps-1">Factories</span>
                            </div>
                        </router-link>

                        <router-link class="nav-link sidebar-menu" :class="{ active: ['console:license_key.index'].includes($route.name) }" :to="{ name: 'console:license_key.index' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fas fa-clipboard-check"></span>
                                </span>
                                <span class="nav-link-text ps-1">Licenses</span>
                            </div>
                        </router-link>
                        
                        <!-- <router-link class="nav-link sidebar-menu" :class="{ active: 'working-days'.includes($route.name) }" :to="{ name: 'console:working_days' }" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="bi bi-tools"></span>
                                </span>
                                <span class="nav-link-text ps-1">Settings</span>
                            </div>
                        </router-link> -->
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import AppConfig from '@/config/AppConfig'
import { onMounted } from 'vue'

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