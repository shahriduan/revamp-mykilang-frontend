<template>
    <div class="card h-100 cursor-pointer border" :class="{ 'border-success': isSubscribed, 'border-danger': isSubscribed == false }">
        <div class="card-body">
            <div class="row gy-2">
                <div class="col-12">
                    <div class="row">
                        <div class="col-3">
                            <img src="/img/illustrations/data-management.png" class="img-fluid" />
                        </div>
                        <div class="col-9">
                            <h5>{{ moduleName }}</h5>
                            <span class="badge rounded-pill badge-subtle-success" v-if="isSubscribed == true">Subscribed</span>
                            <span class="badge rounded-pill badge-subtle-danger" v-else>Not Subscribed</span>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <p class="fs--1 mb-0 text-justify">{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    description: {
        type: String
    },
    isSubscribed: {
        type: Boolean
    },
    moduleName: {
        type: String
    },
    modulePackage: {
        type: String
    }
})
</script>
