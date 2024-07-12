<template>
    <div class="card h-100">
        <div class="card-header bg-body-tertiary pb-0 text-end">
            <div class="col-auto align-self-center">
                <h6 class="mb-0 text-center">Stock Aging</h6>
            </div>
        </div>
        <div class="card-body">
            <div style="min-height: 350px;" data-echart-responsive="true" ref="stockAgingRef"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

onMounted(() => {
    initializeChart()
})

const stockAgingRef = ref(null)
let chartInstance
const stockAgeData = []

const barHorizontalOptions = {
    tooltip: {},
    legend: {
        show: false,
        data: []
    },
    xAxis: {
        type: 'category',
        data: [],
        name: 'Aging',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 95,
        boundaryGap: 10,
        axisLabel: {
            show: true,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            margin: 5,
            rotate: 45,
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
    },
    yAxis: {
        type: 'value',
        name: 'Hours',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 50,
        boundaryGap: 0,
        axisLabel: {
            show: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            margin: 30
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: true
        },
    },
    series: [{
        type: 'bar',
        data: [],
    }],
    grid: {
        left: '10%',
        right: '3%',
        bottom: '15%',
        top: '5%',
        containLabel: true,
    },
    // dataZoom: [{
    //     type: 'inside',
    //     startValue: 0,
    //     endValue: 30,
    // }],
}

watchEffect(() => {
    if (props.parentProps && props.parentProps.stock_aging) {
        updateChart(props.parentProps.stock_aging);
    }
})

function updateChart(stockAgingData) {
    const stockAgeData = stockAgingData.map(item => item.total)
    barHorizontalOptions.xAxis.data = stockAgingData.map(item => item.label)
    barHorizontalOptions.series[0].data = stockAgeData
    chartInstance.setOption(barHorizontalOptions)
}

function initializeChart() {
    chartInstance = echarts.init(stockAgingRef.value)
    chartInstance.setOption(barHorizontalOptions)
}
</script>

<style lang="css" scoped></style>