<template>
    <div class="card-body">
        <div class="chart-container">
            <div class="echart-vertical-stacked-chart-example" style="min-height: 350px;" data-echart-responsive="true"
                id="downTimeChart" ref="downTimeChartRef">
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onUpdated } from 'vue'

let chartInstance
const downTimeChartRef = ref(null)

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

const verticalBarOptions = {
    yAxis: {
        type: 'value',
        name: 'Minutes',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 16,
            fontWeight: 500,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
        nameGap: 50,
        boundaryGap: 0,
        axisLabel: {
            show: true,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            margin: 15
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
        axisPointer: {
            type: 'shadow',
        },
        tooltip: {
            show: true,
        },
    },
    xAxis: {
        type: 'category',
        data: [],
        name: 'Departments',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 16,
            fontWeight: 500,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
        nameGap: 35,
        axisLabel: {
            show: true,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            margin: 15
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
    },
    series: [{
        type: 'bar',
        name: 'Total',
        data: [],
        itemStyle: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-primary'),
            borderRadius: [3, 3, 0, 0]
        },
        showSymbol: false,
        symbol: 'circle',
        smooth: false,
        emphasis: {
            scale: true
        },
        label: {
            show: true,
            verticalAlign: 'middle',
            formatter: function (params) {
                return params.value === 0 ? '' : parseInt(params.value)
            },
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100'),
        },
    }],
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            const duration = params.value
            return `${params.name}: ${duration} Minutes`
        }
    },
    grid: {
        left: '4%',
        right: '1%',
        bottom: '8%',
        top: '7%',
        containLabel: true,
    },
    animationDuration: 2000,
}

const updateChart = (data) => {
    const departments = Array.from(new Set(data.map((entry) => entry.department_name)))

    verticalBarOptions.xAxis.data = departments
    verticalBarOptions.series[0].data = departments.map((department) => {
        const totalDurationMinutes = data
            .filter((entry) => entry.department_name === department)
            .reduce((sum, entry) => sum + entry.downtime_duration, 0) / 60
        return totalDurationMinutes.toFixed(0)
    })

    if (! chartInstance) {
        chartInstance = echarts.init(downTimeChartRef.value)
    }

    chartInstance.setOption(verticalBarOptions)
}

onMounted(() => {
    updateChart(props.parentProps.data.flat())
})

onUpdated(() => {
    updateChart(props.parentProps.data.flat())
})
</script>

<style lang="css" scoped>
.chart-container {
    min-height: 350px;
    height: 100%;
    margin-bottom: -10px;
}
</style>
