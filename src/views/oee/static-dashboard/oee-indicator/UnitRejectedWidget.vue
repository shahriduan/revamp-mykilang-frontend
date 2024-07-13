<template>
    <span class="fw-medium h3" data-echart-responsive="true" ref="unitRejectedRef">0</span>
    <h6>Unit Rejected</h6>
    <h6>(Pcs)</h6>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { CountUp } from 'countup.js'

const unitRejectedRef = ref(null)
let unitRejectedCountUp

const props = defineProps({
    unitReject: {
        required: true,
        type: Number
    },
})

onMounted(() => {
    initializeCountUp()
})

watch(() => props.unitReject, (newValue, oldValue) => {
    initializeCountUp()
})

function initializeCountUp() {
    if (unitRejectedCountUp) unitRejectedCountUp.update(props.unitReject)
    else unitRejectedCountUp = new CountUp(unitRejectedRef.value, props.unitReject)

    // Start count-up animation
    unitRejectedCountUp.start()
}
</script>


<style lang="css" scoped>
.unit {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
}
</style>