<template>
    <div class="card-body">
        <div class="chart-container">
            <div style="min-height: 500px;" data-echart-responsive="true" ref="shiftChartRef">
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onUpdated, computed } from 'vue'
import { tooltipFormatter } from '@/utils/EchartsUtils'

let chartInstance
const shiftChartRef = ref(null)

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

const yAxisData = computed(() => Object.keys(props.parentProps.data))
const seriesData = computed(() => Object.values(props.parentProps.data))

const horizontalBarOptions = {
    yAxis: {
        type: 'category',
        data: yAxisData.value,
        name: 'Shifts',
        nameTextStyle: {
            fontSize: 16,
            fontWeight: 500,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
        boundaryGap: true,
        axisLabel: {
            show: true,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            margin: 10
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-300')
            }
        },
        axisPointer: {
            type: 'shadow',
        },
    },
    xAxis: {
        type: 'value',
        name: 'Hours',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 16,
            fontWeight: 500,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
        nameGap: 35,
        boundaryGap: false,
        axisLine: {
            show: true,
            lineStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-300')
            }
        },
        axisTick: {
            show: true
        },
        axisLabel: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
        },
        splitLine: {
            show: false
        }
    },
    series: [
        {
            type: 'bar',
            name: 'Total',
            data: seriesData.value,
            barWidth: 40,
            label: {
                show: true,
                position: 'inside',
                formatter: function (params) {
                    return params.value === 0 ? '' : params.value
                },
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100'),
            },
            lineStyle: { color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-primary') },
            itemStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-primary'),
                borderRadius: [0, 3, 3, 0]
            }
        }
    ],
    tooltip: {
        trigger: 'axis',
        padding: [7, 10],
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-100'),
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-200'),
        textStyle: { color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100') },
        borderWidth: 1,
        formatter: tooltipFormatter,
        transitionDuration: 0,
        axisPointer: {
            type: 'none'
        }
    },
    grid: {
        left: '1%',
        right: '2%',
        top: '8%',
        bottom: '40%',
        containLabel: true,
    }
}

onMounted(() => {
    chartInstance = echarts.init(shiftChartRef.value)
    chartInstance.setOption(horizontalBarOptions)
})

onUpdated(() => {
    if (chartInstance) {
        horizontalBarOptions.yAxis.data = yAxisData.value
        horizontalBarOptions.series[0].data = seriesData.value
        chartInstance.setOption(horizontalBarOptions)
    }
})
</script>

<style lang="css" scoped>
.chart-container {
    min-height: 350px;
    height: 100%;
    margin-bottom: -170px;
}
</style>
