<template>
    <div class="card h-100">
        <div class="card-body d-flex flex-center flex-column">
            <div ref="gaugeRef" style="width: 140px; height: 140px"></div>
            <div class="text-center">
                <h5 class="mb-1 mt-1">{{ title }}</h5>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, onUpdated, ref } from 'vue'

const props = defineProps({
	title: String,
	percentage: {
		type: Number,
		default: 0
	}
})

const gaugeRef = ref(null)
let chartInstance

const gaugeOption = ref({
	series: [{
		type: 'gauge',
		radius: '90%',
		startAngle: 90,
		endAngle: -270,
		pointer: {
			show: false
		},
		progress: {
			show: true,
			overlap: false,
			roundCap: true,
			clip: false,
			itemStyle: {
				borderWidth: 1,
				borderColor: getComputedStyle(document.documentElement).getPropertyValue('--falcon-warning')
			}
		},
		axisLine: {
			lineStyle: {
				width: 15,
				color: [[1, getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-200')]]
			}
		},
		splitLine: {
			show: false,
			distance: 0,
			length: 10
		},
		axisTick: {
			show: false
		},
		axisLabel: {
			show: false,
			distance: 50
		},
		data: [{
			value: 0, // Value from parent
			title: {
				offsetCenter: ['0%', '0%']
			},
			detail: {
				offsetCenter: ['7%', '4%']
			},
			itemStyle: {
				color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-warning')
			}			
		}],
		title: {
			fontSize: 14
		},
		detail: {
			width: 50,
			height: 14,
			fontSize: 28,
			fontWeight: 500,
			color: 'inherit',
			formatter: '{value}%',
			valueAnimation: true,
			color: getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100') // Percentage text
		},
		animationDuration: 3000, 
	}]
})

onMounted(() => {
	if (! chartInstance) {
		chartInstance = echarts.init(gaugeRef.value)
		chartInstance.setOption(gaugeOption.value)
	}
})

onUpdated(() => {
	if (chartInstance) {
		gaugeOption.value.series[0].data[0].value = props.percentage.toFixed(0)
		gaugeOption.value.animationDurationUpdate = 3000
		chartInstance.setOption(gaugeOption.value)
	}
})
</script>