<template>
    <div class="card">
        <div class="card-header py-2 text-end" style="background-color: #152b48;">
            <div class="col-auto align-self-center">
                <h6 class="text-center text-white mb-0" style="font-size: 16.4px;">UNIT PRODUCED</h6>
            </div>
        </div>
        <div class="card-body unit">
            <div class="row g-3">
                <div class="col-sm-12">
                    <div v-if="parentProps && parentProps.quality_output">
                        <div v-for="(quality, index) in parentProps.quality_output" :key="index.quality">
                            <div class="bg-secondary fw-bold text-white">{{ quality.machine_name }}</div>
                            <div class="row">
                                <div class="col-4">
                                    <UnitShouldProducedWidget :unit-defect="quality.plan_quantity" />
                                </div>
                                <div class="col-4">
                                    <UnitProduceWidget :unit-produce="quality.actual_quantity" />
                                </div>
                                <div class="col-4">
                                    <UnitRejectedWidget :unit-reject="quality.bad_quantity" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CountUp } from 'countup.js'
import { ref, onMounted, watch } from 'vue'
import UnitProduceWidget from '@/views/oee/static-dashboard/oee-indicator/UnitProduceWidget.vue'
import UnitShouldProducedWidget from '@/views/oee/static-dashboard/oee-indicator/UnitShouldProducedWidget.vue'
import UnitRejectedWidget from '@/views/oee/static-dashboard/oee-indicator/UnitRejectedWidget.vue'

const unitActualRef = ref(null)
let unitActualCountUp

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    },
    dateFilter: {
        required: true,
        type: String
    },
    selectedProductionLines: {
        required: true,
        type: Array
    }
})

onMounted(() => {
    initializeCountUp()
})

watch(() => props.parentProps, (newValue, oldValue) => {
    initializeCountUp()
})

function initializeCountUp() {
    if (unitActualCountUp) unitActualCountUp.update(props.parentProps.unit_should_produce)
    else unitActualCountUp = new CountUp(unitActualRef.value, props.parentProps.unit_should_produce)

    // Start count-up animation
    unitActualCountUp.start()
}
</script>

<style lang="css" scoped>
.unit {
    margin-top: 2px;
    margin-bottom: 2px;
    text-align: center;
}
</style>