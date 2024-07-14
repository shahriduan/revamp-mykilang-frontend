<template>
    <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand">
        <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation">
            <span class="navbar-toggle-icon">
                <span class="toggle-line"></span>
            </span>
        </button>

        <NavbarBrandLogo />

        <ul class="navbar-nav navbar-nav-icons ms-auto flex-row align-items-center">
            <GoToModuleDropdownList v-if="$route.meta.moduleCode" />
            <MyAccountNavItemDropdown />
        </ul>
    </nav>
</template>

<script setup>
import NavbarBrandLogo from '@/layouts/_shared/NavbarBrandLogo.vue'
import GoToModuleDropdownList from '@/layouts/_shared/GoToModuleDropdownList.vue'
import MyAccountNavItemDropdown from '@/layouts/_shared/MyAccountNavItemDropdown.vue'
</script>