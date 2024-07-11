<template>
    <div class="card h-100 cursor-pointer border shadow-none">
        <div class="card-img-top mt-2">
            <img src="/img/illustrations/data-management.png" class="img-medium" />
        </div>
        <div class="card-body">
            <h5 class="card-title text-center">{{ moduleName }}</h5>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    moduleName: {
        type: String
    }
})
</script>

<style lang="css" scoped>
.img-medium {
    max-width: 100px;
}
.card-img-top {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
