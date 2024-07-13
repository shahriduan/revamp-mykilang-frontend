<template>
    <PageHeaderTitle>
        <h5>Factory Timeline</h5>
    </PageHeaderTitle>
    
    <div class="row mt-4 mb-3 gy-2 gy-sm-0">
        <div class="col-md-3 col-lg-4 col-xxl-6"></div>
        <div class="col-12 col-sm-6 col-md-5 col-lg-4 col-xxl-3 pe-sm-2">
            <input class="form-control datetimepicker" id="datepicker" type="text" v-model="dateFilter" placeholder="Date" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xxl-3 ps-sm-2">
            <input class="form-control" type="text" placeholder="Factories" readonly style="cursor: pointer" @click="showFactoryModal()" />
        </div>
    </div>

    <div class="mb-1 d-flex align-items-center">
        <span class="h5 me-2">Filters by: </span>
        <span class="badge rounded-pill bg-primary" v-if="selectedProductionLines.length == 0">All Production Line</span>
        <span v-else>
            <h4><span class="badge rounded-pill bg-dark me-1" v-for="lineName in selectedProductionLineNameList">{{ lineName }}</span></h4>
        </span>
    </div>

    <div class="modal fade" id="factoryModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content position-relative">
                <div class="position-absolute top-0 end-0 mt-2 me-2 z-1">
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                        <h4 class="mb-1">Factories</h4>
                    </div>
                    <div class="p-4">
                        <div class="form-check mb-0">
                            <input class="form-check-input" id="all-station" type="checkbox" v-model="selectAll" @change="markAllFactories(selectAll)" />
                            <label class="form-check-label" for="all-station">All Stations</label>
                        </div>
                        <div v-for="station in stationData">
                            <div class="form-check mb-0" style="margin-left: 23px">
                                <input class="form-check-input" :id="'station'+station.id"  type="checkbox" :true-value="station.id" :false-value="null" v-model="selectedFactory[station.id]" @change="markAllProductionLines(station.id)" />
                                <label class="form-check-label" :for="'station'+station.id">{{ station.name }}</label>
                            </div>
                            <div class="form-check mb-0" style="margin-left: 46px" v-for="productionLine in station.production_line">
                                <input class="form-check-input" :id="'line'+productionLine.id" type="checkbox" :true-value="productionLine.id" :false-value="null" v-model="productionLinesInput[productionLine.id]" />
                                <label class="form-check-label" :for="'line'+productionLine.id">{{ productionLine.name }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                    <button class="btn btn-primary" type="button" data-bs-dismiss="modal" @click="applyFilter">Apply Filter</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 
        TODO|Low : Buat masa sekarang biar hardcode dulu. Nanti kalau ada masa gantikan dgn API
     -->
    <div class="fs--1 mt-3 mb-2">
        <div class="d-flex justify-content-end mb-1">
            <div class="d-flex align-items-center me-2">
                <span class="dot" style="background-color: #979A9A"></span>
                <span class="fw-semi-bold">Holidays</span>
            </div>
            <!-- <div class="d-flex align-items-center mx-2">
                <span class="dot" style="background-color: #2B2B2B;"></span>
                <span class="fw-semi-bold">Non-Working Hours</span>
            </div>
            <div class="d-flex align-items-center mx-2">
                <span class="dot" style="background-color: #F5B041"></span>
                <span class="fw-semi-bold">Idle</span>
            </div> -->
            <div class="d-flex align-items-center mx-2">
                <span class="dot" style="background-color: #4EA930"></span>
                <span class="fw-semi-bold">Production</span>
            </div>
            <div class="d-flex align-items-center mx-2">
                <span class="dot" style="background-color: #7A1E1B"></span>
                <span class="fw-semi-bold">Downtime</span>
            </div>
        </div>
    </div>
                      
    <div class="mb-4" v-for="factoryTimeline in factoryTimelines" v-if="factoryTimelines.length > 0">
        <h3>{{ factoryTimeline.factory_name }}</h3>
        <span>({{ displayTotalStation(factoryTimeline.production_line.length) }})</span>
        <div
            :id="`factory_timeline_${factoryTimeline.factory_id}`"
            :style="`width: 100%; height: ${totalChartHeight(factoryTimeline.production_line.length)}px`">
        </div>
        <hr>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import flatpickr from 'flatpickr'
import apiRoute from '@/helpers/ApiHelper'
import dayjs from 'dayjs'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import PageHeaderTitle from '@/views/oee/_shared/PageHeaderTitle.vue'

const stationData = ref([])
const factoryList = ref([])
const productionLineList = ref([])
const productionLineNameList = ref([])
const selectedProductionLineNameList = ref([])
const selectedFactory = ref([])
const factoryTimelines = ref([]) // Data from API
const chartInstance = ref([]) // Multiple chart instance for multiple factory
const chartElementId = ref([]) // Element ID

const dateFilter = ref(dayjs().format('DD/MM/YYYY'))
const productionLinesInput = ref([])
const unconfirmSelectedProductionLines = computed(() => productionLinesInput.value.filter((value) => value != null))
const selectedProductionLines = ref([])
const selectAll = ref(false)

onMounted(async () => {
    flatpickr('#datepicker', {
        dateFormat: 'd/m/Y',
        defaultDate: 'today',
        maxDate: 'today',
        disableMobile: true,
        onChange: (date) => {
            dateFilter.value = dayjs(date[0]).format('DD/MM/YYYY')
            getFactoryTimeline()
        }
    })
    
    await getProductionLineAccessData()

    await getFactoryTimeline()
})

const displayTotalStation = (total) => {
    var word = total > 1 ? 'stations' : 'station'
    return total + ' ' + word
}

const totalChartHeight = (totalProductionLine) => {
    const oneLine = 160 // In px
    const additionalLineHeight = 65 // In px
    var height = oneLine // Default height for one production line

    if (totalProductionLine > 1) {
        var balanceAdditionalLine = totalProductionLine - 1
        var currentAdditionalLine = balanceAdditionalLine * additionalLineHeight
        height = height + currentAdditionalLine
    }

    return height
}

function destroyAllChart() {
    chartInstance.value.forEach((item) => {
        item.dispose() // Remove amcharts element
    })

    chartElementId.value.forEach(item => {
        document.getElementById(item).outerHTML; // Remove div element
    })

    factoryTimelines.value = []
    chartInstance.value = []
    chartElementId.value = []
}

async function showFactoryModal() {
    const myModalEl = document.getElementById('factoryModal')
    const modal = new bootstrap.Modal(myModalEl, {
        keyboard: false
    })
    modal.show()

    if (stationData.value.length == 0) {
        await getProductionLineAccessData()
    }
}

async function getProductionLineAccessData() {
    await window.axios.get(apiRoute({ name: 'api:user_access.production_line_list' }))
        .then(function(response) {
                stationData.value = response.data.data

                stationData.value.forEach(station => {
                    factoryList.value.push(station)

                    station.production_line.forEach(prod => {
                        productionLineList.value.push(prod)
                    })
                })

                // Create new list without group
                if (stationData.value.length > 0) {
                    var combine = []

                    stationData.value.forEach((item) => {
                        var line = item.production_line.map((productionLine) => {
                            return {
                                'id': productionLine.id,
                                'name': productionLine.name
                            }
                        })

                        combine = [...line, ...combine]
                    })

                    productionLineNameList.value = combine
                }
        })
        .catch(function(error) {
            
        })
}

async function applyFilter() {
    selectedProductionLines.value = unconfirmSelectedProductionLines.value

    // Show production line name on badge
    var filteredName = productionLineNameList.value.filter((item) => {
        return selectedProductionLines.value.includes(item.id)
    })
    filteredName = JSON.parse(JSON.stringify(filteredName))
    filteredName = filteredName.sort((a, b) =>  a.name.localeCompare(b.name)).map(value => value.name)

    selectedProductionLineNameList.value = filteredName

    await getFactoryTimeline()
}

function markAllFactories(selected = false) {
    factoryList.value.map((fact) => {
        selectedFactory.value[fact.id] = selected == true ? fact.id : null
    })

    productionLineList.value.forEach((prod) => {
        productionLinesInput.value[prod.id] = selected == true ? prod.id : null
    })
}

function markAllProductionLines(factoryId) {
    const factory = stationData.value.find(f => f.id === factoryId)

    factory.production_line.forEach(production => {
        productionLinesInput.value[production.id] = selectedFactory.value[factoryId] != null ? production.id : null
    })
}

async function getFactoryTimeline() {
    destroyAllChart()
    
    await window.axios.get(
            apiRoute({ 
                name: 'api_oee:default_dashboard.factory_timeline', 
                query: { 
                    date: dayjs(dateFilter.value, 'DD/MM/YYYY').format('YYYY-MM-DD'), 
                    production_line: selectedProductionLines.value.toString() 
                } 
            })
        )
        .then(response => {
            factoryTimelines.value = response.data.data

            factoryTimelines.value.forEach((item, index) => {
                chartElementId.value.push(`factory_timeline_${item.factory_id}`)
                nextTick(() => {
                    renderChartTimeline(`factory_timeline_${item.factory_id}`, item)
                })
            })
        })

}

function renderChartTimeline(elementId, factoryObject) {
    var amchartInstance = am5.Root.new(elementId)

    chartInstance.value.push(amchartInstance)

    amchartInstance.dateFormatter.setAll({
        dateFormat: 'hh:mm a',
        dateFields: ['valueX', 'openValueX']
    })

    // Create chart
    var chart = amchartInstance.container.children.push(am5xy.XYChart.new(amchartInstance, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        layout: amchartInstance.verticalLayout
    }))

    var data = []
    var newData = []

    var yAxisData = []
    var newYAxisData = []

    factoryObject.production_line.forEach((item, index) => {
        newYAxisData = { category: item.name }
        yAxisData.push(newYAxisData)

        item.event.forEach((eventItem) => {
            newData = {
                category: item.name,
                start: new Date(eventItem.start_at).getTime(),
                end: new Date(eventItem.end_at).getTime(),
                columnSettings: {
                    fill: eventItem.color_code
                },
                task: eventItem.event_name
            }

            data.push(newData)
        })
    })

    // Create axes
    var yRenderer = am5xy.AxisRendererY.new(amchartInstance, {
        minorGridEnabled: true
    })

    yRenderer.grid.template.set("location", 1)

    var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(amchartInstance, {
            categoryField: "category",
            renderer: yRenderer,
            tooltip: am5.Tooltip.new(amchartInstance, {})
        })
    )

    yAxis.data.setAll(yAxisData)

    var xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(amchartInstance, {
                baseInterval: { timeUnit: "minute", count: 1 },
                renderer: am5xy.AxisRendererX.new(amchartInstance, {
                strokeOpacity: 0.1,
                minorGridEnabled: true,
                minGridDistance: 80
            })
        })
    )

    yAxis.get("renderer").labels.template.adapters.add('fill', (fill, target) => {
        return getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100')
    })

    xAxis.get("renderer").labels.template.adapters.add('fill', (fill, target) => {
        return getComputedStyle(document.documentElement).getPropertyValue('--falcon-gray-1100')
    })

    // Add series
    var series = chart.series.push(am5xy.ColumnSeries.new(amchartInstance, {
        xAxis: xAxis,
        yAxis: yAxis,
        openValueXField: "start",
        valueXField: "end",
        categoryYField: "category",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(amchartInstance, {
            autoTextColor: false,
            
        })
    }))

    series.columns.template.setAll({
        templateField: "columnSettings",
        strokeOpacity: 0,
        tooltipText: "{task}:\n{openValueX} - {valueX}"
    })

    series.data.setAll(data)

    // Add scrollbars
    chart.set('scrollbarX', am5.Scrollbar.new(amchartInstance, { orientation: "horizontal" }))

    // Make animation on load
    series.appear()
    chart.appear(1000, 100)
}
</script>
