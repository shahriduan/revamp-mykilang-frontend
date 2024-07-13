<template>
    <div class="card h-100">
        <div class="card-header py-2 text-end" style="background-color: #152b48;">
            <div class="col-auto align-self-center">
                <h6 class="text-center text-white mb-0" style="font-size: 16.4px;">RECORD OF DOWNTIME</h6>
            </div>
        </div>
        <div class="card-body containerBox">
            <div style="min-height: 400px;" data-echart-responsive="true" ref="barRef"></div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { snackbar } from '@/components/Snackbar'
import { ref, onMounted, watchEffect } from 'vue'
import UtilityHelper from '@/helpers/UtilityHelper'

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    },
    dateFilter: {
        required: true,
        type: String
    },
    selectedProductionLines: {
        required: true,
        type: Array
    }
})

onMounted(() => {
    initializeChart()
})

const barRef = ref(null)
let chartInstance

const barHorizontalOptions = {
    title: {
        text: '',
        left: 'center',
        top: 'middle',
        textStyle: {
            color: 'grey',
            fontSize: 20
        }
    },
    yAxis: {
        type: 'category',
        data: [],
        name: 'Downtime Event',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 170,
        boundaryGap: true,
        axisLabel: {
            show: true,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
            margin: 5,
            rotate: 0,
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
            type: 'shadow'
        }
    },
    xAxis: {
        type: 'value',
        name: 'Hours',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 45,
        boundaryGap: false,
        axisLine: {
            show: true,
            lineStyle: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-300')
            }
        },
        axisLabel: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-700'),
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            show: true
        },
    },
    series: [],
    tooltip: {
        transitionDuration: 0,
        axisPointer: {
            type: 'none'
        },
    },
    legend: {
        show: false,
        data: []
    },
    grid: {
        left: '10%',
        right: '8%',
        bottom: '13%',
        top: '1%',
        containLabel: true,
    },
    dataZoom: [{
        type: 'inside',
        startValue: 0,
        endValue: 30,
    }],
}

watchEffect(() => {
    if (props.parentProps && props.parentProps.availability_output) {
        updateChart(props.parentProps.availability_output)
    }
})

function updateChart(recordDowntime) {
    const yAxisData = recordDowntime.map(item => item.downtime_problem)
    const hasData = recordDowntime.length > 0
    
    if (!hasData) {
        // Clear the chart and show a message if there's no data
        chartInstance.clear()
        chartInstance.setOption({
            title: {
                text: 'No downtime occurred',
                left: 'center',
                top: 'middle',
                textStyle: {
                    color: 'grey',
                    fontSize: 20
                }
            }
        })
        return
    }

    const seriesData = [{
        type: 'bar',
        stack: 'stack',
        barWidth: '40%',
        label: {
            show: true,
            position: 'inside',
        },
        data: recordDowntime.map(item => {
            const durationInHours = (item.duration / 3600).toFixed(2)
            return {
                value: durationInHours,
                label: {
                    show: durationInHours !== '0.00' // Set show to false if duration is zero
                }
            }
        })
    }]

    const utilityHelper = new UtilityHelper()
    const colorCodes = utilityHelper.listRandomColorCode(1)

    seriesData[0].itemStyle = {
        color: colorCodes[0],
    }

    barHorizontalOptions.legend.data = ['Downtime Duration']
    barHorizontalOptions.yAxis.data = yAxisData
    barHorizontalOptions.series = seriesData
    
    if (chartInstance) {
        chartInstance.setOption(barHorizontalOptions)
    }
}

function initializeChart() {
    if (barRef.value) {
        chartInstance = echarts.init(barRef.value)
        chartInstance.setOption(barHorizontalOptions)
    }
}
</script>

<style lang="css" scoped>
.containerBox {
    height: 100%;
    margin: 6px;
    padding: 6px;
}
</style>
