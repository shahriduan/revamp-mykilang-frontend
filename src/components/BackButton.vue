<template>
    <router-link :to="props.route" class="btn btn-outline-dark">
        <i class="fas fa-arrow-left me-1"></i> Back 
    </router-link>
</template>

<script setup>
const props = defineProps({
    // Using vue router object
    // Example: { name: 'routeName', params: { id: 1 } }
    route: {
        type: Object,
        required: true
    }
})
</script>

<!-- 
    This is an example on how to use this component

    <BackButton route="{ name: 'routeName', params: { id: 1 } }" />
-->