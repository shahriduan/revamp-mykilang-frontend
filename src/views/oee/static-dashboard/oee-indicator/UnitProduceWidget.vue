<template>
    <span class="fw-medium h3" data-echart-responsive="true" ref="unitProducedRef">0</span>
    <h6>Unit Produced</h6>
    <h6>(Pcs)</h6>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { CountUp } from 'countup.js'

const unitProducedRef = ref(null)
let unitProducedCountUp

const props = defineProps({
    unitProduce: {
        required: true,
        type: Number
    }
})


onMounted(() => {
    initializeCountUp()
})

watch(() => props.unitProduce, (newValue, oldValue) => {
    initializeCountUp()
})

function initializeCountUp() {
    if (unitProducedCountUp) unitProducedCountUp.update(props.unitProduce)
    else unitProducedCountUp = new CountUp(unitProducedRef.value, props.unitProduce)

    // Start count-up animation
    unitProducedCountUp.start()
}
</script>


<style lang="css" scoped>
.unit {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
}
</style>