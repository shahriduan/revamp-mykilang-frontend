<template>
    <div class="btn-group">
        <a :href="manualLink" class="btn btn-primary" style="opacity: 0.9" target="_blank">
            Download User Manual {{ softwareName }}
        </a>
        <a :href="manualLink" class="btn btn-primary" target="_blank">
            <i class="fas fa-arrow-down"></i>
        </a>
    </div>
</template>

<script setup>
const props = defineProps(['manualLink', 'softwareName'])
</script>