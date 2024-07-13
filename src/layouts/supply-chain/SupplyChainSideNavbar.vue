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
                        <div class="mb-2">
                            <NavbarVerticalDivider>Supply Chain</NavbarVerticalDivider>
                        </div>
                        <SidebarNavLink 
                            :is-active-nav="['spc:dashboard'].includes($route.name)" 
                            :route-name="{ name: 'spc:dashboard' }" 
                            title="Main Menu">
                            <i class="bi bi-house-fill"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['spc:warehouse'].includes($route.name)" 
                            :route-name="{ name: 'spc:warehouse' }" 
                            title="Warehouse">
                            <i class="bi bi-buildings-fill"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['spc:production'].includes($route.name)" 
                            :route-name="{ name: 'spc:production' }" 
                            title="Production">
                            <i class="bi bi-calendar-week"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['spc:asset'].includes($route.name)" 
                            :route-name="{ name: 'spc:asset' }" 
                            title="Asset">
                            <i class="bi bi-table"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['spc:inventory'].includes($route.name)" 
                            :route-name="{ name: 'spc:inventory' }" 
                            title="Inventory">
                            <i class="bi bi-file-earmark-spreadsheet-fill"></i>
                        </SidebarNavLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import AppConfig from '@/config/AppConfig'
import SidebarNavLink from '@/layouts/_shared/SidebarNavLink.vue'
import NavbarVerticalDivider from '@/layouts/_shared/NavbarVerticalDivider.vue'
</script>