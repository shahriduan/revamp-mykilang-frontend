<template>
    <div class="card">
        <div class="card-body py-0 px-0">
            <div class="list-group list-group-light list-group-small">
                <router-link :to="{ name: 'account.change_email' }" class="list-group-item list-group-item-action px-3" :class="{ active: $route.name == 'account.change_email' }">
                    <i class="bi bi-envelope fa-lg me-3"></i> Change Email
                </router-link>
                <router-link :to="{ name: 'account.change_password' }" class="list-group-item list-group-item-action px-3" :class="{ active: $route.name == 'account.change_password' }">
                    <i class="bi bi-lock fa-lg me-3"></i> Change Password
                </router-link>
                <router-link :to="{ name: 'account.system_setting' }" class="list-group-item list-group-item-action px-3" :class="{ active: $route.name == 'account.system_setting' }">
                    <i class="bi bi-gear fa-lg me-3"></i> System Settings
                </router-link>
                <router-link :to="{ name: 'account.security_check' }" class="list-group-item list-group-item-action px-3" :class="{ active: $route.name == 'account.security_check' }">
                    <i class="bi bi-shield-lock fa-lg me-3"></i> Security Checks
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
.list-group-light .active {
    border-radius: 0px;
}
.list-group-item:first-child, .list-group-item:first-child:hover {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}
.list-group-item:last-child, .list-group-item:last-child:hover {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
}
.list-group-item-action:hover {
    border-radius: 0px;
}
</style>