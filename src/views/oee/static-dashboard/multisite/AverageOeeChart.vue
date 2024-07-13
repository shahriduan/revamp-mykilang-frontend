<template>
    <div class="card h-100">
        <div class="card-header bg-body-tertiary pb-0 text-end">
            <div class="form-check form-check-inline" v-for="timeframe in timeframes">
                <input
                    class="form-check-input"
                    :id="'averageoee'+timeframe"
                    type="radio"
                    name="average-oee-timeframe"
                    v-model="selectedTimeframe"
                    :value="timeframe"
                    @click="changeTimeframe(timeframe)"
                />
                <label class="form-check-label" :for="'averageoee'+timeframe">
                    {{ timeframe }}
                </label>
            </div>
        </div>
        <div class="card-body">
            <div style="min-height: 300px;" data-echart-responsive="true" ref="chartRef"></div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, reactive, computed, onUpdated } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import ConstantConfig from '@/config/ConstantConfig'

const props = defineProps({
    parentProps: {
        type: Array,
        required: true
    }
})

const cookie = useCookies([
    ConstantConfig.appCookie.oee.mainDashboardTimeframeFilter
])

const chartRef = ref(null)
let chartInstance

const rawData = ref(props.parentProps) // Raw data from database
const timeframes = ['Day', 'Month', 'Year']
const selectedTimeframe = ref('Day') // User input timeframe

const xAxisData = computed(() => {
    return rawData.value.map((item) => selectedTimeframe.value == 'Day' ? item.day : (selectedTimeframe.value == 'Month' ? item.month : item.year))
        .filter((value, index, array) => array.indexOf(value) === index)
})

const yAxisData = computed(() => {
    var chartData = []

    xAxisData.value.forEach((xAxisItem) => {
        var filteredData = rawData.value
            .filter((rawItem) => {
                var timeframeValue = selectedTimeframe.value == 'Day' ? rawItem.day : (selectedTimeframe.value == 'Month' ? rawItem.month : rawItem.year)
                return timeframeValue == xAxisItem
            })

        var totalCountFiltered = filteredData.length

        var sumFilteredData = filteredData.reduce((total, reduceItem) => total + reduceItem.oee, 0)
        var averagefilteredData = sumFilteredData / totalCountFiltered

        chartData.push(averagefilteredData.toFixed(0))
    })

    return chartData
})

const barChartOptions = reactive({
    height: 225,
    tooltip: {
        trigger: 'item',
    },
    dataZoom: [{
        type: 'inside',
        startValue: 0,
        endValue: 30,
    }],
    xAxis: {
        type: 'category',
        name: 'Month',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 40,
        data: xAxisData,
        axisLine: {
            lineStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
                type: 'solid'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            formatter: function formatter(value) {
                return value
            },
            margin: 15
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        name: 'Average OEE (%)',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
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
    },
    series: [{
        type: 'bar',
        name: 'Average',
        data: yAxisData,
        lineStyle: {
            color: '#fff'
        },
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
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-light'),
        },
    }],
    grid: {
        right: '3%',
        left: '10%',
        bottom: '10%',
        top: '5%'
    },
    animationDuration: 2000,
})

onMounted(() => {
    loadFilterFromCookies()

  	chartInstance = echarts.init(chartRef.value)
  	chartInstance.setOption(barChartOptions)
})

onUpdated(() => {
    rawData.value = props.parentProps

    if (chartInstance) {
        barChartOptions.xAxis.name = selectedTimeframe.value
        chartInstance.setOption(barChartOptions)
    }
})

function loadFilterFromCookies() {
    selectedTimeframe.value = cookie.get(ConstantConfig.appCookie.oee.mainDashboardTimeframeFilter) != undefined
        ? cookie.get(ConstantConfig.appCookie.oee.mainDashboardTimeframeFilter)
        : 'Day'
}

function changeTimeframe(timeframe) {
    selectedTimeframe.value = timeframe

    // Store filter in cookies
    cookie.set(ConstantConfig.appCookie.oee.mainDashboardTimeframeFilter, selectedTimeframe.value)
}
</script>
