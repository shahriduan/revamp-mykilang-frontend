<template>
    <div class="btn-group">
        <a :href="softwareLink" class="btn btn-primary" style="opacity: 0.9" target="_blank">
            Download {{ softwareName }}
        </a>
        <a :href="softwareLink" class="btn btn-primary" target="_blank">
            <i class="fas fa-arrow-down"></i>
        </a>
    </div>
</template>

<script setup>
const props = defineProps(['softwareLink', 'softwareName'])
</script>