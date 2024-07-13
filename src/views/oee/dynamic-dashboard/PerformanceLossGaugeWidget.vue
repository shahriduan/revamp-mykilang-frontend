<template>
    <div class="card-body">
        <div class="chart-container">
            <div class="performance-loss-gauge" :id="'performance-loss-gauge-' + props.parentProps.id" ref="gaugeChart"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, reactive, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

let chartInstance
const gaugeChart = ref(null)

const performanceLossPercent = computed(() => props.parentProps.data != null ? props.parentProps.data.toFixed(2) : 0)

const chartOptions = reactive({
    series: [
        {
            type: 'gauge',
            radius: '100%',
            startAngle: 180,
            endAngle: 0,
            pointer: {
                show: false,
            },
            progress: {
                show: true,
                overlap: false,
                roundCap: false,
                clip: false,
                itemStyle: {
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--falcon-primary')
                }
            },
            axisLine: {
                lineStyle: {
                    width: 30,
                    color: [[1, getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-200')]]
                },
            },
            splitLine: {
                show: false,
                distance: 0,
                length: 10,
            },
            axisLabel: {
                show: true,
                formatter: function (value) {
                    // Display only labels at 0 & 100
                    return value === 0 || value === 100 ? value : ''
                },
                distance: 30,
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            },
            axisTick: {
                show: false,
            },
            detail: {
                width: 50,
                height: 14,
                fontSize: 28,
                fontWeight: 500,
                color: 'inherit',
                formatter: '{value}%',
                valueAnimation: true,
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100') 
            },
            animationDuration: 3000,
            data: [{ 
                value: performanceLossPercent.value,
                itemStyle: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-primary')
                },
                detail: {
                    offsetCenter: ['0%', '-15%']
                },
            }]
        },
    ],
})

onMounted(() => {
    chartInstance = echarts.init(gaugeChart.value)
    chartInstance.setOption(chartOptions)   
})

onUpdated(() => {
    if (chartInstance) {
        chartOptions.series[0].data[0].value = performanceLossPercent.value
        chartInstance.setOption(chartOptions)
    }
})
</script>

<style lang="css" scoped>
.chart-container {
    margin-top: -10px;
    margin-bottom: -140px;
}
.performance-loss-gauge {
    min-height: 300px !important;
    width: 100%;
    z-index: -1px;
}
</style>