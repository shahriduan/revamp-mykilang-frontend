<template>
    <span class="fw-medium h3" data-echart-responsive="true" ref="unitDefectedRef">0</span>
    <h6>Unit Should Produced</h6>
    <h6>(Pcs)</h6>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { CountUp } from 'countup.js'

const unitDefectedRef = ref(null)
let unitDefectedCountUp

const props = defineProps({
    unitDefect: {
        required: true,
        type: Number
    },
})

onMounted(() => {
    initializeCountUp()
})

watch(() => props.unitDefect, (newValue, oldValue) => {
    initializeCountUp()
})

function initializeCountUp() {
    if (unitDefectedCountUp) unitDefectedCountUp.update(props.unitDefect)
    else unitDefectedCountUp = new CountUp(unitDefectedRef.value, props.unitDefect)

    unitDefectedCountUp.start()
}
</script>

<style lang="css" scoped>
.unit {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
}
</style>