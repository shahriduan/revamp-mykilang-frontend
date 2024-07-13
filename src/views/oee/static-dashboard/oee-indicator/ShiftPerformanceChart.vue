<template>
    <div class="card h-100">
        <div class="card-header py-2 text-end" style="background-color: #152b48;">
            <div class="col-auto align-self-center">
                <h6 class="text-center text-white mb-0" style="font-size: 16.4px;">SHIFT PERFORMANCE</h6>
            </div>
        </div>
        <div class="card-body containerBox">
            <div style="min-height: 350px;" data-echart-responsive="true" ref="horizontalBarWithLines"></div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, watchEffect } from 'vue'

const horizontalBarWithLines = ref([])
let chartInstance

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

watchEffect(() => {
    if (props.parentProps && props.parentProps.performance_output) {
        updateChart(props.parentProps.performance_output)
    }
})

function initializeChart() {
    if (horizontalBarWithLines.value) {
        chartInstance = echarts.init(horizontalBarWithLines.value)
    }
}

function updateChart(shiftPerformance) {
    const hasData = shiftPerformance.length > 0

    if (!hasData) {
        // Clear the chart and show a message if there's no data
        chartInstance.clear()
        chartInstance.setOption({
            title: {
                text: 'No data for specific date picked',
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

    const yAxisData = shiftPerformance.map(item => item.shift_name)
    const performanceLossTime = shiftPerformance.map(item => item.result_performance_percent.toFixed(2))
    const sLossTime = shiftPerformance.map(item => item.result_loss_percent.toFixed(2))

    const option = {
        title: {
            text: '', // Clear the "No data" message
        },
        yAxis: {
            type: 'category',
            data: yAxisData,
            name: 'Shift',
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
            },
            splitLine: {
                show: false,
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
            name: 'OEE Performance (%)',
            nameLocation: 'center',
            nameTextStyle: {
                fontSize: 17,
                fontWeight: 600,
                color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
            },
            nameGap: 60,
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
                show: false
            },
            axisTick: {
                show: true
            },
            max: 100,
        },
        series: [
            {
                name: 'Shift Performance',
                data: performanceLossTime,
                type: 'bar',
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'inside',
                }
            },
            {
                name: 'Shift Loss',
                data: sLossTime,
                type: 'bar',
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'inside',
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            transitionDuration: 0,
            axisPointer: {
                type: 'none'
            }
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '20%',
            top: '3%',
            containLabel: true,
        },
        dataZoom: [{
            type: 'inside',
            startValue: 0,
            endValue: 100,
        }],
    }
    chartInstance.setOption(option, true) // Use true to merge options
}
</script>


<style lang="css" scoped>
.containerBox {
    height: 100%;
    margin: 6px;
    padding: 6px;
}
</style>
