<template>
    <router-link class="nav-link sidebar-menu" :class="{ active: isActiveNav }" :to="routeName" role="button">
        <div class="d-flex align-items-center">
            <span class="nav-link-icon">
                <slot />
            </span>
            <span class="nav-link-text">{{ titleRef }}</span>
        </div>
    </router-link>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
    isActiveNav: {
        type: Boolean,
        default() {
            return false
        }
    },
    routeName: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

const titleRef = computed(() => props.title)

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
