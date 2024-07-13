<template>
    <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand">
        <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation">
            <span class="navbar-toggle-icon">
                <span class="toggle-line"></span>
            </span>
        </button>

        <a class="navbar-brand me-1 me-sm-3" href="/">
            <div class="d-flex align-items-center">
                <img :src="AppConfig.systemLogo" width="120" alt="Logo" />
            </div>
        </a>

        <div class="navbar-nav ms-auto flex-row align-items-center" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <router-link :to="{ name: 'asm:dashboard' }">
                        <a class="nav-link" href="#">Dashboard</a>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: 'asm:asset' }">
                        <a class="nav-link" href="#">Assets</a>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: 'asm:alarm_settings' }">
                        <a class="nav-link" href="#">Alarm Settings</a>
                    </router-link>
                </li>
            </ul>
        </div>

        <ul class="navbar-nav navbar-nav-icons ms-auto flex-row align-items-center">
            <GoToModuleDropdownList />
            <li class="nav-item dropdown">
                <a class="nav-link pe-0 ps-2" id="navbarDropdownUser" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div class="avatar avatar-xl">
                        <img class="rounded-circle" src="/img/icons/user.png" alt="Icon" />
                    </div>
                </a>
                <div class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end py-0" aria-labelledby="navbarDropdownUser">
                    <div class="bg-white dark__bg-1000 rounded-2 py-2">
                        <router-link class="dropdown-item" :to="{ name: 'console:account.change_email' }">
                            <i class="fas fa-user me-2"></i> My Account
                        </router-link>
                        <router-link class="dropdown-item" :to="{ name: 'console:logout' }">
                            <i class="fas fa-sign-out-alt me-2"></i> Sign Out
                        </router-link>
                    </div>
                </div>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import AppConfig from '@/config/AppConfig'
import GoToModuleDropdownList from '@/layouts/_shared/GoToModuleDropdownList.vue'
</script>