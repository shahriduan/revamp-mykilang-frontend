<template>
    <div class="card-body">
        <div class="chart-container mb-4">
            <span class="fw-medium h1" :id="'planproductiontime-countup-' + props.parentProps.id"></span>
            <h5>Plan Production Time</h5>
            <h6>(Hours)</h6>
        </div>
    </div>
</template>

<script setup>
import { onUpdated, onMounted, computed } from 'vue'
import { CountUp } from 'countup.js'

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

const countupValue = computed(() => props.parentProps.data ?? 0)

const numberAnimation = () => {
    var numAnim = new CountUp('planproductiontime-countup-' + props.parentProps.id, countupValue.value, {
        decimalPlaces: Number.isInteger(countupValue.value) ? 0 : 2
    })
    numAnim.start()
}

onMounted(() => {
    numberAnimation()
})

onUpdated(() => {
    numberAnimation()
})
</script>

<style lang="css" scoped>
.chart-container {
    margin-top: 35px;
    margin-bottom: 35px;
    text-align: center;
}
</style>

