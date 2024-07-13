<template>
    <div class="card-header bg-body-tertiary py-2">
        <div class="d-flex justify-content-between">
            <div class="align-self-center me-1">
                <i class="fa-solid fa-arrow-up order-icon-color" @click="changePosition('up')" style="cursor: pointer" v-if="isFirst == false"></i>
            </div>
            <h5 class="mb-0 text-center">{{ title }}</h5>
            <div class="align-self-center ms-1">
                <i class="fa-solid fa-arrow-down order-icon-color" @click="changePosition('down')" style="cursor: pointer" v-if="isLast == false"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    widgetId: {
        type: Number,
        required: true
    },
    isFirst: {
        type: Boolean,
        required: true
    },
    isLast: {
        type: Boolean,
        required: true
    }
})
const emit = defineEmits(['reorderWidget'])

async function changePosition(positionAction) {
    emit('reorderWidget', positionAction)

    await window.axios.post(apiRoute({ name: 'api_oee:user_dashboard.reorder_widget', params: { dashboardWidget: props.widgetId } }), {
            position: positionAction == 'up' ? 'up' : 'down'
        })
        .catch(error => {
            snackbar('Unexpected Error: Unable to change widget order.')
        })
}
</script>

<style scoped>
[data-bs-theme=light] .order-icon-color:hover {
    color: var(--falcon-primary);
}
[data-bs-theme=dark] .order-icon-color:hover {
    color: #ffffff;
}
.order-icon-color:hover {
    -webkit-animation: glow 1s ease-in-out infinite alternate;
    -moz-animation: glow 1s ease-in-out infinite alternate;
    animation: glow 1s ease-in-out infinite alternate;
}
</style>