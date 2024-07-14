<template>
    <div class="d-flex justify-content-end mt-4 mb-2">
        <i class="bi bi-arrow-clockwise me-1"></i>Last Update : {{ currentTime }}
    </div>

    <div class="mb-2">
        <NavbarVerticalDivider>Health Status</NavbarVerticalDivider>
    </div>

    <div class="row g-2 mt-1">
        <div class="container scollbar">
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 mb-1 text-center scroll4">
                <div class="card border shadow-none h-100">
                    <div class="card-img-top m-0">
                        <img class="img-medium" src="/img/asset-monitoring/inactive.png" style="width: 40%; height: auto" />
                    </div>
                    <div class="card-body p-1">
                        <h5 class="card-title text-center">Pump 1</h5>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 mb-1 text-center scroll4">
                <div class="card border shadow-none h-100">
                    <div class="card-img-top m-0">
                        <img class="img-fluid" src="/img/asset-monitoring/inactive.png" style="width: 40%; height: auto" />
                    </div>
                    <div class="card-body p-1">
                        <h5 class="card-title text-center">Pump 2</h5>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 mb-1 text-center scroll4">
                <div class="card border shadow-none h-100">
                    <div class="card-img-top m-0">
                        <img class="img-fluid" src="/img/asset-monitoring/active.png" style="width: 40%; height: auto" />
                    </div>
                    <div class="card-body p-1">
                        <h5 class="card-title text-center">Pump 3</h5>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 mb-1 text-center scroll4">
                <div class="card border shadow-none h-100">
                    <div class="card-img-top m-0">
                        <img class="img-fluid" src="/img/asset-monitoring/active.png" style="width: 40%; height: auto" />
                    </div>
                    <div class="card-body p-1">
                        <h5 class="card-title text-center">Pump 4</h5>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 mb-1 text-center scroll4">
                <div class="card border shadow-none h-100">
                    <div class="card-img-top m-0">
                        <img class="img-fluid" src="/img/asset-monitoring/active.png" style="width: 40%; height: auto;" />
                    </div>
                    <div class="card-body p-1">
                        <h5 class="card-title text-center">Pump 5</h5>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 mb-1 text-center scroll4">
                <div class="card border shadow-none h-100">
                    <div class="card-img-top m-0">
                        <img class="img-fluid" src="/img/asset-monitoring/inactive.png" style="width: 40%; height: auto;" />
                    </div>
                    <div class="card-body p-1">
                        <h5 class="card-title text-center">Pump 6</h5>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 mb-1 text-center scroll4">
                <div class="card border shadow-none h-100">
                    <div class="card-img-top m-0">
                        <img class="img-fluid" src="/img/asset-monitoring/active.png" style="width: 40%; height: auto;" />
                    </div>
                    <div class="card-body p-1">
                        <h5 class="card-title text-center">Pump 7</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-3 mb-1">
        <NavbarVerticalDivider>Pump Performance</NavbarVerticalDivider>
    </div>

    <div class="d-flex justify-content-end mt-1 mb-0">
        <div class="form-check form-check-inline">
            <input class="form-check-input" id="inlineCheckbox1" type="checkbox" value="option1" />
            <label class="form-check-label" for="inlineCheckbox1">Power Consumption</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" id="inlineCheckbox2" type="checkbox" value="option2" />
            <label class="form-check-label" for="inlineCheckbox2">Vibration</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" id="inlineCheckbox3" type="checkbox" value="option3" />
            <label class="form-check-label" for="inlineCheckbox3">Temperature</label>
        </div>
    </div>
    <div class="row g-1">
        <div class="col-sm-4 col-lg-3">
            <div class="card border shadow-none bg-transparent">
                <div class="card-img-top m-0 text-center">
                    <img class="img-medium" src="/img/asset-monitoring/blue_pump.png" style="width: 40%; height: auto" />
                </div>
                <div class="card-body p-1">
                    <h5 class="card-title text-center">Pump 1</h5>
                </div>
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">Pump Health: </p>
                        <p class="fw-bold mb-0">Good</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">Alarm Count: </p>
                        <p class="fw-bold mb-0">0</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">Electrical Power: </p>
                        <p class="fw-bold mb-0">3294.72 kW</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">Energy Consumption: </p>
                        <p class="fw-bold mb-0">1041.28 kW</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">Efficiency: </p>
                        <p class="fw-bold mb-0">59.47 %</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">Temperature: </p>
                        <p class="fw-bold mb-0">160 C</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="mb-0">Vibration: </p>
                        <p class="fw-bold mb-0">160 dB</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-8 col-lg-9">
            <div class="card border shadow-none rounded">
                <div class="card-body">
                    <label class="form-label" for="customRange1">Power Consumption</label>
                    <input class="form-range" id="customRange1" type="range" />
                    <div class="echart-line-chart" style="min-height: 300px;" data-echart-responsive="true" ref="chartPower"></div>
                </div>
            </div>
            <div class="card border shadow-none rounded">
                <div class="card-body">
                    <label class="form-label" for="customRange2">Temperature</label>
                    <input class="form-range" id="customRange2" type="range" />
                    <div class="echart-line-chart" style="min-height: 300px;" data-echart-responsive="true" ref="chartTemperature"></div>
                </div>
            </div>
            <div class="card border shadow-none rounded">
                <div class="card-body">
                    <label class="form-label" for="customRange3">Vibration</label>
                    <input class="form-range" id="customRange3" type="range" />
                    <div class="echart-line-chart" style="min-height: 300px;" data-echart-responsive="true" ref="chartVibration"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import NavbarVerticalDivider from '@/layouts/_shared/NavbarVerticalDivider.vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'

const currentTime = ref()
const chartPower = ref(null)
const chartTemperature = ref(null)
const chartVibration = ref(null)

onMounted(() => {
    useIntervalFn(() => {
        currentTime.value = dayjs().format('dddd, DD/MM/YYYY, hh:mm:ss A')
    })
    const chartInstancePower = echarts.init(chartPower.value)
    chartInstancePower.setOption(optionPower)

    const chartInstanceTemperature = echarts.init(chartTemperature.value)
    chartInstanceTemperature.setOption(optionTemperature)

    const chartInstanceVibration = echarts.init(chartVibration.value)
    chartInstanceVibration.setOption(optionVibration)
})

const optionPower = {
    xAxis: {
        type: 'category',
        data: [
            '10:21:00', '10:21:10', '10:21:20', '10:21:30', '10:21:40', '10:21:50',
            '10:22:00', '10:22:10', '10:22:20', '10:22:30'
        ],
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
    yAxis: {
        type: 'value',
        name: 'Kilowatt (kW)',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 110,
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
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260, 260, 260, 150],
            type: 'line'
        }
    ],
    grid: {
        left: '10%',
        right: '8%',
        bottom: '13%',
        top: '20%',
        containLabel: true,
    },
}

const optionTemperature = {
    xAxis: {
        type: 'category',
        data: [
            '10:21:00', '10:21:10', '10:21:20', '10:21:30', '10:21:40', '10:21:50',
            '10:22:00', '10:22:10', '10:22:20', '10:22:30'
        ],
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
    yAxis: {
        type: 'value',
        name: 'Celcius (C)',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 80,
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
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260, 260, 260, 150],
            type: 'line'
        }
    ]
}

const optionVibration = {
    xAxis: {
        type: 'category',
        data: [
            '10:21:00', '10:21:10', '10:21:20', '10:21:30', '10:21:40', '10:21:50',
            '10:22:00', '10:22:10', '10:22:20', '10:22:30'
        ],
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
    yAxis: {
        type: 'value',
        name: 'Decibel (dB)',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 17,
            fontWeight: 600,
            color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1000')
        },
        nameGap: 80,
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
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260, 260, 260, 150],
            type: 'line'
        }
    ]
}
</script>

<style scoped>
/* vertical scollbar */
.scollbar {
    overflow-x: hidden;
    white-space: nowrap;
}

.scollbar:hover {
    overflow-x: scroll;
}

.scroll4 {
    display: inline-block;
    color: red;
    text-align: center;
    padding: 4px;
    text-decoration: none;
}

.scollbar::-webkit-scrollbar {
    scrollbar-width: thin;
}

.scollbar::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 20px;
}

.scollbar::-webkit-scrollbar-track {
    background: #ddd;
    border-radius: 20px;
}

.echart-line-chart {
    width: 100%;
    height: 100%;
}
</style>