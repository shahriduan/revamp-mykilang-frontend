<template>
    <div class="card-body pt-0">
        <div class="d-flex bg-200 pt-2 pb-0 justify-content-center mx-nx1">
            <div class="form-check form-check-inline mb-0" v-for="timeframe in timeframes">
                <input
                    type="radio"
                    class="form-check-input"
                    :id="'hours-operated-' + timeframe + '-' + props.parentProps.id"
                    :name="'hours-operated-' + props.parentProps.id"
                    :value="timeframe"
                    v-model="selectedTimeframe"
                    @click="changeTimeframe(timeframe)"
                />
                <label class="form-check-label" :for="'hours-operated-' + timeframe + '-' + props.parentProps.id">
                    {{ timeframe }}
                </label>
            </div>
        </div>
        <div class="chart-container mt-2">
            <div
                class="echart-vertical-grouped-chart-example"
                style="min-height: 350px;"
                data-echart-responsive="true"
                :id="'hours-operated-chart-' + props.parentProps.id"
                ref="hoursOperatedRef">
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, reactive, computed, onUpdated, nextTick } from 'vue'
import { tooltipFormatter } from '@/utils/EchartsUtils'
import UtilityHelper from '@/helpers/UtilityHelper'

const utilityHelper = new UtilityHelper

const props = defineProps({
    parentProps: {
        type: Object,
        required: true
    }
})

let chartInstance // Initialize chart instance
const hoursOperatedRef = ref(null) // Chart model
const rawData = computed(() => props.parentProps.data.raw) // Raw data from database
const timeframes = ['Day', 'Month', 'Year']
const selectedTimeframe = ref('Day') // User input timeframe

const xAxisData = computed(() => {
    return rawData.value.map((item) => selectedTimeframe.value == 'Day' ? item.day : (selectedTimeframe.value == 'Month' ? item.month : item.year))
        .filter((value, index, array) => array.indexOf(value) === index)
})

const uniqueItemIds = computed(() => Array.from(new Set(rawData.value.map(raw => raw.item_code))).sort())

const seriesData = computed(() => {
    var allChartSeries = []

    uniqueItemIds.value.forEach((item, index) => {
        var chartData = []
        var oneSeries = []

        xAxisData.value.forEach((xAxisItem) => {
            var filteredData = rawData.value
                .filter((rawItem) => {
                    var timeframeValue = selectedTimeframe.value == 'Day' ? rawItem.day : (selectedTimeframe.value == 'Month' ? rawItem.month : rawItem.year)
                    return rawItem.item_code == item && timeframeValue == xAxisItem
                })
                .reduce((total, reduceItem) => total + reduceItem.hours_operated, 0)

            chartData.push(filteredData.toFixed(1))
        })

        var dataName = rawData.value.filter((nameItem) => nameItem.item_code == item)[0].item_name

        oneSeries = {
            name: dataName,
            type: 'bar',
            itemStyle: {
                borderRadius: [5, 5, 0, 0]
            },
            data: chartData
        }

        allChartSeries.push(oneSeries)
    })

    // Add random color
    const listcolor = utilityHelper.listRandomColorCode(uniqueItemIds.value.length);
    allChartSeries.map((colorItem, colorIndex) => colorItem['color'] = listcolor[colorIndex])

    return allChartSeries
})

const barChartOptions = reactive({
    yAxis: {
        type: 'value',
        name: 'Hours Operated',
        axisLabel: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
        splitLine: {
            lineStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-200')
            }
        },
        nameLocation: 'middle',
        nameGap: 35,
        nameTextStyle: {
            fontSize: 16,
            fontWeight: 500,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
    },
    xAxis: {
        type: 'category',
        data: xAxisData.value, // x-Axis initial value
        splitLine: { show: false },
        axisLabel: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
        axisLine: {
            lineStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-600')
            }
        }
    },
    series: seriesData.value, // y-Axis initial value
    tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        padding: [7, 10],
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-100'),
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-300'),
        textStyle: { color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100') },
        borderWidth: 1,
        transitionDuration: 0,
        formatter: tooltipFormatter
    },
    legend: {
        show: true,
        left: 'right',
        data: seriesData.value.map(value => value.name), // Legend value
        textStyle: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700')
        },
    },
    grid: {
        left: '4%',
        right: '1%',
        bottom: '3%',
        top: '20%',
        containLabel: true,
    },
    dataZoom: [{
        type: 'inside',
        startValue: 0,
        endValue: 30,
    }],
})

onMounted(() => {
    if (! chartInstance) {
        chartInstance = echarts.init(document.getElementById('hours-operated-chart-' + props.parentProps.id));
        chartInstance.setOption(barChartOptions);
    }
})

onUpdated(() => {
    if (chartInstance) {
        barChartOptions.xAxis.data = xAxisData.value
        barChartOptions.series = seriesData.value

        chartInstance.setOption(barChartOptions)
    }
})

function changeTimeframe(frame) {
    selectedTimeframe.value = frame

    // TODO|Medium: change timeframe feature and store in database
}
</script>

<style lang="css" scoped>
.chart-container {
    min-height: 350px;
    height: 100%;
}
</style>
