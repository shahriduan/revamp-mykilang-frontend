<template>
    <div class="card-body">
        <div class="chart-container">
            <div style="min-height: 450px" data-echart-responsive="true" ref="effectiveChart">
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onUpdated } from 'vue'

const effectiveChart = ref(null)

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

let chartInstance

const updateChart = () => {
    const xAxisData = props.parentProps.data.averages.map((item) => item.name)

    const seriesData = ['remaining_value', 'schedule_loss', 'availability_loss', 'performance_loss', 'quality_loss'].map((attr) => ({
        name: formatLegendName(attr),
        type: 'bar',
        stack: 'OEE',
        data: props.parentProps.data.averages.map((item) => item[attr]).reverse(),
    }))

    chartInstance.setOption({
        legend: {
            data: seriesData.map((item) => item.name),
            left: 'right',
            textStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
            },
        },
        xAxis: {
            type: 'value',
            name: 'Percentage (%)',
            nameLocation: 'center',
            nameTextStyle: {
                fontSize: 16,
                fontWeight: 500,
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
            },
            nameGap: 60,
            boundaryGap: 0,
            axisLabel: {
                show: true,
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
                margin: 30
            },
            splitLine: {
                lineStyle: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-200')
                }
            },
        },
        yAxis: {
            type: 'category',
            data: xAxisData.reverse(),
            name: 'Attributes',
            nameLocation: 'center',
            nameTextStyle: {
                fontSize: 16,
                fontWeight: 500,
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
            },
            nameGap: 165,
            boundaryGap: 0,
            axisLabel: {
                show: true,
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
                margin: 10
            },
            axisPointer: {
                type: 'shadow',
            },
            tooltip: {
                show: true,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return `${params.seriesName}: ${params.value.toFixed(2)}`
            },
        },
        series: seriesData,
    })
}

const formatLegendName = (name) => {
    if (name == 'remaining_value') {
        name = 'effectiveness'    
    }

    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const horizontalStackedBarOptions = {
    grid: {
        left: '5%',
        right: '3%',
        bottom: '35%',
        top: '15%',
        containLabel: true,
    },
}

onMounted(() => {
    chartInstance = echarts.init(effectiveChart.value)
    chartInstance.setOption(horizontalStackedBarOptions)
    updateChart()
})

onUpdated(() => {
    updateChart()
})
</script>

<style lang="css" scoped>
.chart-container {
    min-height: 350px;
    height: 100%;
    margin-bottom: -120px;
}
</style>