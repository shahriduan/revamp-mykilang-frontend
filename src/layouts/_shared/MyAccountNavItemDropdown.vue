<template>
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
</template>

<script setup>

</script>
