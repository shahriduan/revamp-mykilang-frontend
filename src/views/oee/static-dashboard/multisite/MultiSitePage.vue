<template>
    <PageHeaderTitle>
        <h5>Multi-Site</h5>
    </PageHeaderTitle>

    <div class="row py-3 g-3">
        <div class="col-0 col-md-3 col-lg-6"></div>
        <div class="col-7 col-md-5 col-lg-4">
            <div class="input-group">
                <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-calendar-days"></i></span>
                <input class="form-control datetimepicker" id="datepicker" type="text" v-model="dateFilter" placeholder="Date" />
            </div>
        </div>
        <div class="col-5 col-md-4 col-lg-2">
            <button class="btn btn-secondary w-100" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom"><i class="fa-solid fa-circle-info me-2"></i>OEE Benchmark</button>
        </div>
    </div>

    <div class="offcanvas offcanvas-bottom" :style="{ height: offcanvasHeight }" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
        <div class="offcanvas-header px-4 pt-4">
            <h5 class="offcanvas-title" id="offcanvasBottomLabel">General OEE Benchmark</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body px-4">
            <div class="row row-cols-1 row-cols-md-1 row-cols-lg-2 g-4">
                <div class="col">
                    <div class="progress" :style="{ height: progressBarHeight }">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: 40%;" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                            <div class="text-wrap fw-bold">
                                Low Range <br/>(0% - 40%)
                            </div>
                        </div>
                        <div class="progress-bar" role="progressbar" style="width: 20%; background-color: #ffc107;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
                            <div class="text-wrap fw-bold">
                                Acceptable Range <br/>(40% - 60%)
                            </div>
                        </div>
                        <div class="progress-bar bg-success" role="progressbar" style="width: 25%;" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                            <div class="text-wrap fw-bold">
                                Target Range <br/>(60% - 85%)
                            </div>
                        </div>
                        <div class="progress-bar" role="progressbar" style="width: 15%; background-color: #02ab64;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                            <div class="text-wrap fw-bold">
                                World Class <br/>(85% - 100%)
                            </div>
                        </div>
                    </div>
                    <div class="d-none d-sm-none d-md-block">
                        <div class="d-flex justify-content-between mt-3">
                            <div>0%</div>
                            <div>10%</div>
                            <div>20%</div>
                            <div>30%</div>
                            <div>40%</div>
                            <div>50%</div>
                            <div>60%</div>
                            <div>70%</div>
                            <div>80%</div>
                            <div>90%</div>
                            <div>100%</div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <ul>
                        <li>85% and above = This is world class, which few manufacturers achieve.</li>
                        <li>60% - 85% = This is a good target range for manufacturers.</li>
                        <li>40% - 60% = This range is a reasonable OEE score, where many manufacturers find themselves.</li>
                        <li>40% or less = This is really too low, and action needs to be taken to raise OEE.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="card mb-3">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-sm table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th width="100px">#</th>
                            <th>
                                <div class="form-check-inline">
                                    <input class="form-check-input" id="all-station" type="checkbox" v-model="selectAll" @change="markAllFactories(selectAll)" />
                                    <label class="form-check-label" for="all-station"></label>
                                </div>
                                
                            </th>
                            <th class="text-center">Average OEE (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(factory, factoryIndex) in factoriesData" :key="factoryIndex">
                            <tr class="align-middle hover-pointer">
                                <th width="100px">Plant {{ factoryIndex + 1 }}</th>
                                <td>
                                    <div class="form-check-inline">
                                        <input class="form-check-input" :id="'station'+factory.factory_id"  type="checkbox" :true-value="factory.factory_id" :false-value="null" v-model="selectedFactory[factory.factory_id]" @change="markAllProductionLines(factory.factory_id)" />
                                        <label class="form-check-label" :for="'station'+factory.factory_id"></label>
                                    </div>
                                    <span class="fw-bold">{{ factory.factory_name }}</span>
                                </td>
                                <td class="text-center fw-bold py-0">
                                    <span class="text-white px-2" :style="averageOeeStyle(factory.average_oee_factory)">
                                        {{ Math.round(factory.average_oee_factory ?? 0) }}
                                    </span>
                                </td>
                            </tr>
                            <tr class="align-middle hover-pointer" v-for="(productionLine, productionLineIndex) in factory.production_lines" :key="productionLineIndex">
                                <td></td>
                                <td style="padding-left: 30px">
                                    <div class="form-check-inline">
                                        <input class="form-check-input" :id="'line'+productionLine.production_line_id" type="checkbox" :true-value="productionLine.production_line_id" :false-value="null" v-model="productionLinesInput[productionLine.production_line_id]" @change="markProductionLine(factory.factory_id)"/>
                                        <label class="form-check-label" :for="'line'+productionLine.production_line_id"></label>
                                    </div>
                                    {{ productionLine.production_line_name }}
                                </td>
                                <td class="text-center fw-bold py-0">
                                    <span class="text-white px-2" :style="averageOeeStyle(productionLine.average_oee_production_line)">
                                        {{ Math.round(productionLine.average_oee_production_line ?? 0) }}
                                    </span>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                    <tfoot class="border-top-2 border-bottom-2 border-secondary-subtle">
                        <tr>
                            <th colspan="2">Average OEE for {{ stationsData.company_name }}</th>
                            <td class="text-center fw-bold py-0">
                                <span class="text-white px-2" :style="averageOeeStyle(stationsData.average_oee_company)">
                                    {{ Math.round(stationsData.average_oee_company ?? 0) }}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>

    <div class="mt-3">
        <AverageOEEChart :parent-props="chartOee" />
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { snackbar } from '@/components/Snackbar'
import flatpickr from 'flatpickr'
import apiRoute from '@/helpers/ApiHelper'
import dayjs from 'dayjs'
import ConstantConfig from '@/config/ConstantConfig'
import PageHeaderTitle from '@/views/oee/_shared/PageHeaderTitle.vue'
import AverageOEEChart from '@/views/oee/static-dashboard/multisite/AverageOeeChart.vue'

const cookie = useCookies([
    ConstantConfig.appCookie.oee.mainDashboardDateFilter,
    ConstantConfig.appCookie.oee.mainDashboardProductionLineFilter
])

const chartOee = ref([])
const stationsData = ref([])
const factoriesData = ref([])

const selectAll = ref(false)

const factoryList = ref([])
const selectedFactory = ref([])

const productionLineList = ref([])
const selectedProductionLines = ref([])
const productionLinesInput = ref([])
const unconfirmSelectedProductionLines = computed(() => productionLinesInput.value.filter((value) => value != null))

const dateFilter = ref(dayjs().format('DD/MM/YYYY'))
const startDate = ref(dayjs().format('YYYY-MM-DD'))
const endDate = ref(dayjs().format('YYYY-MM-DD'))

const progressBarHeight = ref('100px')
const offcanvasHeight = ref('')

onMounted(async () => {
    await loadFilterFromCookies()

    flatpickr('#datepicker', {
        mode: 'range',
        dateFormat: 'd/m/Y',
        defaultDate: [dayjs(startDate.value).format('DD/MM/YYYY'), dayjs(endDate.value).format('DD/MM/YYYY')],
        maxDate: 'today',
        disableMobile: true,
        onChange: async (date) => {
            var datepickerStart = date[0]
            startDate.value = dayjs(datepickerStart).format('YYYY-MM-DD')

            if (date[1]) {
                var datepickerEnd = date[1]
                endDate.value = dayjs(datepickerEnd).format('YYYY-MM-DD')
            }

            if (datepickerStart != undefined && datepickerEnd != undefined) {
                await getDefaultDashboard()
                storeFilterDateIntoCookies()
            }
        }
    })

    resizeCanvas()

    await applyFilter()
    markAllFactories(true)
})
const averageOeeStyle = (oee) => {
    return { 
        'background-color': benchmarkColor(oee),
        'width': '42px',
        'display': 'inline-block',
        'padding-top': '4px', 
        'padding-bottom': '4px'
    }
}

const benchmarkColor = (oee) => {
    var color

    if (oee <= 40) {
        color = '#e63757'
    } else if (oee >= 41 && oee <= 60) {
        color = '#ffc107'
    } else if (oee >= 61 && oee <= 85) {
        color = '#00d27a'
    } else {
        color = '#02ab64'
    }

    return color
}

const resizeCanvas = () => {
    const width = window.innerWidth

    // xs (phones) and sm (tablets)
    if (width <= 576) { 
        offcanvasHeight.value = '65%'

    // md (small laptops)
    } else if (width >= 768 && width < 992) { 
        offcanvasHeight.value = '43%'
    }

  if (width < 768) { // xs and sm
        progressBarHeight.value = '95px'
    } else {
        progressBarHeight.value = '70px'
    }
}

async function loadFilterFromCookies() {
    // Date filter
    const savedDateFilter = cookie.get(ConstantConfig.appCookie.oee.mainDashboardDateFilter)
    if (savedDateFilter) {
        dateFilter.value = savedDateFilter
        if (savedDateFilter.includes('to')) {
            const [start, end] = savedDateFilter.split(' to ')
            startDate.value = dayjs(start, 'DD/MM/YYYY').format('YYYY-MM-DD')
            endDate.value = dayjs(end, 'DD/MM/YYYY').format('YYYY-MM-DD')
        } else {
            startDate.value = dayjs(savedDateFilter, 'DD/MM/YYYY').format('YYYY-MM-DD')
            endDate.value = startDate.value
        }
    } else {
        dateFilter.value = dayjs().format('DD/MM/YYYY')
    }

    // Production lines filter
    if (cookie.get(ConstantConfig.appCookie.oee.mainDashboardProductionLineFilter) != undefined) {
        const lineFromCookies = cookie.get(ConstantConfig.appCookie.oee.mainDashboardProductionLineFilter)

        lineFromCookies.forEach((item) => {
            productionLinesInput.value[item] = item
        })
    }
}

// Store selected dates in cookies
function storeFilterDateIntoCookies() {
    cookie.set(ConstantConfig.appCookie.oee.mainDashboardDateFilter, dateFilter.value)
}

async function applyFilter() {
    const uniqueProductionLines = new Set(unconfirmSelectedProductionLines.value)

    // Loop through factories and add selected production lines
    factoryList.value.forEach(factory => {
        if (selectedFactory.value[factory.factory_id]) {
            factory.production_lines.forEach(productionLine => {
                // Only add production lines that are checked for the selected factory
                if (productionLinesInput.value[productionLine.production_line_id] && selectedFactory.value[productionLine.factory_id] === factory.factory_id) {
                    uniqueProductionLines.add(productionLine.production_line_id)
                }
            })
        }
    })

    selectedProductionLines.value = [...uniqueProductionLines] // Convert Set back to array

    await getDefaultDashboard()

    // Store selected production lines in cookies
    if (selectedProductionLines.value.length > 0) {
       cookie.set(ConstantConfig.appCookie.oee.mainDashboardProductionLineFilter, selectedProductionLines.value)
    }
}

function markAllFactories(selected = false) {
    factoryList.value.map((fact) => {
        selectedFactory.value[fact.factory_id] = selected == true ? fact.factory_id : null
    })

    productionLineList.value.forEach((prod) => {
        productionLinesInput.value[prod.production_line_id] = selected == true ? prod.production_line_id : null
    })

    applyFilter()
}

function markAllProductionLines(factoryId) {
    const factory = factoriesData.value.find(f => f.factory_id === factoryId)

    factory.production_lines.forEach(production => {
        productionLinesInput.value[production.production_line_id] = selectedFactory.value[factoryId] != null ? production.production_line_id : null
    })

    applyFilter()
}

function markProductionLine(factoryId) {
    const factory = factoriesData.value.find(f => f.factory_id === factoryId)

    let allProductionLinesChecked = true
    factory.production_lines.forEach(production => {
        if (!productionLinesInput.value[production.production_line_id]) {
            allProductionLinesChecked = false
        }
    })

    selectedFactory.value[factoryId] = allProductionLinesChecked ? factoryId : null

    applyFilter()
}

async function getDefaultDashboard() {
    try {
        const response = await window.axios.get(apiRoute({ name: 'api_oee:default_dashboard.dashboard_oee', query: { start_date: startDate.value, end_date: endDate.value, production_line: selectedProductionLines.value.toString() } }))

        if (response.data.status == true) {
            chartOee.value = response.data.data.average_oee
            stationsData.value = response.data.data.stations
            factoriesData.value = response.data.data.stations.factories

            // Check if factoriesData.value is not empty
            if (factoriesData.value && factoriesData.value.length > 0) {

                // Clear existing data in factoryList and productionLineList arrays
                factoryList.value = []
                productionLineList.value = []

                factoriesData.value.forEach(factory => {
                    factoryList.value.push(factory)

                    // Check if factory.production_lines is not empty
                    if (factory.production_lines && factory.production_lines.length > 0) {

                        // Check factory checkbox if all production lines are checked
                        let allProductionLinesChecked = true

                        factory.production_lines.forEach(prod => {
                            productionLineList.value.push(prod)
                            if (!productionLinesInput.value[prod.production_line_id]) {
                                allProductionLinesChecked = false
                            }
                        })

                        selectedFactory.value[factory.factory_id] = allProductionLinesChecked ? factory.factory_id : null
                    }
                })

                // Check selectAll checkbox if all factories are checked
                selectAll.value = factoryList.value.every(factory => selectedFactory.value[factory.factory_id] != null)
            }
        }
    } catch (e) {
        snackbar('Error while fetching default dashboard data.')
    }
}
</script>

<style scoped>
.form-check-inline {
    margin-right: .5rem;
}
</style>
