<template>
    <ul class="nav nav-pills custom-nav-pills mt-3">
        <li :class="{ 'nav-item': true, 'is-current-content': $route.name == 'asm:temperature' }">
            <router-link class="nav-link active" :to="{ name: 'asm:temperature' }">
                Temperature
            </router-link>
        </li>
        <li :class="{ 'nav-item mx-3': true, 'is-current-content': $route.name == 'asm:vibration' }">
            <router-link class="nav-link active" :to="{ name: 'asm:vibration' }">
                Vibration
            </router-link>
        </li>
        <li :class="{ 'nav-item': true, 'is-current-content': $route.name == 'asm:power_consumption' }">
            <router-link class="nav-link active" :to="{ name: 'asm:power_consumption' }">
                Power Consumption
            </router-link>
        </li>
    </ul>     
    <slot />
</template>

<script setup>

</script>

<style lang="css" scoped>
.custom-nav-pills .nav-link {
    border-radius: 30px;
    padding: 3px 20px;
}
.is-current-content .active {
    background-color: var(--falcon-dark-bg-subtle) !important;
}
.is-current-content {
    position: relative;
    text-decoration: underline;
    font-weight: 600;

}
.is-current-content:before {
    content: '';
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    position: absolute;
    top: -2px;
    left:-2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing 20s linear infinite;
    opacity: 0;
    transition: opacity .3s ease-in-out;
    border-radius: 10px;
}
.is-current-content:active:after {
    background: transparent;
}
.is-current-content:before {
    opacity: 1;
}
.is-current-content:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 10px;
}
@keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
}
</style>