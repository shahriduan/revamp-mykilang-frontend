<template>
    <div class="fw-bold">TOTAL TIME</div>
  <div class="d-flex flex-row mt-1">
      <div class="circle circle-ladder me-2 align-self-center"></div>
      <p style="font-size:small" class="mb-0 align-self-end">Plan Production Time</p>
  </div>
  <div class="progress">
        <div 
          class="progress-bar" 
          :style="{ width: chartData.planProductionTime + '%', 'background-color': blueColor }" 
          role="progressbar" 
          :aria-valuenow="chartData.planProductionTime" 
          aria-valuemin="0" 
          aria-valuemax="100">
          {{ chartData.planProductionTime.toFixed(0) }}%
      </div>
  </div>

  <div class="fw-bold">AVAILABILTY</div>
  <div class="d-flex flex-row mt-1">
      <div class="circle circle-ladder me-2 align-self-center"></div>
      <p style="font-size:small" class="mb-0 align-self-end">Run Time</p>
      <div class="circle circle-loss ms-3 me-2 align-self-center"></div>
      <p style="font-size:small" class="mb-0 align-self-end">Availability Loss</p>
  </div>
  <div class="progress">
        <div 
          class="progress-bar" 
          :style="{ width: chartData.runTime + '%', 'background-color': blueColor }" 
          role="progressbar" 
          :aria-valuenow="chartData.runTime" 
          aria-valuemin="0" 
          aria-valuemax="100">
          {{ chartData.runTime.toFixed(0) }}%
      </div>
      <div 
          class="progress-bar" 
          :style="{ width: chartData.availabilityLoss + '%', 'background-color': redOneColor }" 
          role="progressbar" 
          :aria-valuenow="chartData.availabilityLoss" 
          aria-valuemin="0" 
          aria-valuemax="100">
          {{ chartData.availabilityLoss.toFixed(0) }}%
      </div>
  </div>

  <div class="fw-bold">PERFORMANCE</div>
  <div class="d-flex flex-row mt-1">
      <div class="circle circle-ladder me-2 align-self-center"></div>
      <p style="font-size:small" class="mb-0 align-self-end">Net Run Time</p>
      <div class="circle circle-loss ms-3 me-2 align-self-center"></div>
      <p style="font-size:small" class="mb-0 align-self-end">Performance Loss</p>
  </div>
  <div class="progress">
        <div 
          class="progress-bar" 
          :style="{ width: chartData.netRunTime + '%', 'background-color': blueColor }" 
          role="progressbar" 
          :aria-valuenow="chartData.netRunTime" 
          aria-valuemin="0" 
          aria-valuemax="100">
          {{ chartData.netRunTime.toFixed(0) }}%
      </div>
      <div 
          class="progress-bar" 
          :style="{ width: chartData.performanceLoss + '%', 'background-color': redOneColor }" 
          role="progressbar" 
          :aria-valuenow="chartData.performanceLoss" 
          aria-valuemin="0" 
          aria-valuemax="100">
          {{ chartData.performanceLoss.toFixed(0) }}%
      </div>
  </div>

  <div class="fw-bold">QUALITY</div>
  <div class="d-flex flex-row mt-1">
      <div class="circle circle-ladder me-2 align-self-center"></div>
      <p style="font-size:small" class="mb-0 align-self-end">Fully Productive Time</p>
      <div class="circle circle-loss ms-3 me-2 align-self-center"></div>
      <p style="font-size:small" class="mb-0 align-self-end">Quality Loss</p>
  </div>
  <div class="progress">
        <div 
          class="progress-bar" 
          :style="{ width: chartData.fullyProductiveTime + '%', 'background-color': blueColor }" 
          role="progressbar" 
          :aria-valuenow="chartData.fullyProductiveTime" 
          aria-valuemin="0" 
          aria-valuemax="100">
          {{ chartData.fullyProductiveTime.toFixed(0) }}%
      </div>
      <div 
          class="progress-bar" 
          :style="{ width: chartData.qualityLoss + '%', 'background-color': redOneColor }" 
          role="progressbar" 
          :aria-valuenow="chartData.qualityLoss" 
          aria-valuemin="0" 
          aria-valuemax="100">
          {{ chartData.qualityLoss.toFixed(0) }}%
      </div>
  </div>
</template>

<script setup>
import { onUpdated, reactive, ref } from 'vue'

const props = defineProps({
  effectiveness: Array
})

const chartData = reactive({
  planProductionTime: 0,
  runTime: 0,
  availabilityLoss: 0,
  netRunTime: 0,
  performanceLoss: 0,
  fullyProductiveTime: 0,
  qualityLoss: 0
})

onUpdated(() => {
  chartData.planProductionTime = props.effectiveness[0].remaining_value
  chartData.runTime = props.effectiveness[1].remaining_value
  chartData.availabilityLoss = props.effectiveness[1].availability_loss

  chartData.netRunTime = props.effectiveness[2].remaining_value
  chartData.performanceLoss = props.effectiveness[2].performance_loss

  chartData.fullyProductiveTime = props.effectiveness[3].remaining_value
  chartData.qualityLoss = props.effectiveness[3].quality_loss
})

const blueColor = ref('#003cff')
const redOneColor = ref('#ff0000')
</script>

<style scoped>
.progress {
  margin-bottom: 10px;
  margin-top: 5px;
}
.circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
.circle-ladder {
  background-color: v-bind(blueColor);
  color: white;
}
.circle-loss {
  background-color: v-bind(redOneColor);
  color: black;
}
</style>