<template>
    <div class="card-header d-flex align-items-center bg-body-tertiary py-1 mb-1 rounded">
        <h6 class="mb-0 flex-1 text-center">Production Details</h6>
        <!-- <div class="btn-reveal-trigger">
            <button class="btn btn-link btn-reveal btn-sm" type="button" @click="refreshData">
                <span class="fas fa-sync-alt fs--1"></span>
            </button>
        </div> -->
    </div>

    <div v-if="parentProps && parentProps.selected_production_day && parentProps.selected_production_day.length">
        <div v-for="(plan, index) in parentProps.selected_production_day" :key="index.plan">
            <div class="card mb-2">
                <div class="card-body">
                    <div>Planner Code: {{ plan.planner_code }}</div>
                    <div>Plan Start Time: {{ formatDate(plan.plan_start_at) }}</div>
                    <div>Plan Finish Time: {{ formatDate(plan.plan_end_at) }}</div>
                    <div>Product: {{ plan.product }}</div>
                    <div>Model: {{ plan.model }}</div>
                    <div>Shift: {{ plan.shift }}</div>
                    <div>Quantity: {{ plan.plan_quantity }}</div>
                    <div>
                        Plan Status:
                        <span class="badge rounded-pill fw-bold h3" :class="{
                            'bg-secondary': plan.plan_status == 'Not Started',
                            'bg-primary': plan.plan_status == 'In Progress',
                            'bg-success': plan.plan_status == 'Completed',
                            'bg-danger': plan.plan_status == 'Cancel',
                        }">
                            {{ plan.plan_status }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="alert alert-info" role="alert">
            Click any date to see details.
        </div>
        <div class="card">
            <div class="card-body">
                <div>Planner Code: -</div>
                <div>Plan Start Time: -</div>
                <div>Plan Finish Time: -</div>
                <div>Product: -</div>
                <div>Model: -</div>
                <div>Shift: -</div>
                <div>Quantity: -</div>
                <div>Plan Status: -</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

//refresh funtion
// const emit = defineEmits(['refreshProductionData'])
// function refreshData() {
//     console.log('Data refreshed');
//     emit('refreshProductionData');
// }

function formatDate(dateTime) {
    if (!dateTime || !dayjs(dateTime).isValid()) {
        return '-'
    } else {
        return dayjs(dateTime).format('DD/MM/YYYY hh:mm A')
    }
}
</script>