<template>
    <PageHeaderTitle>
        <h5>OEE</h5>
    </PageHeaderTitle>

    <div class="row mt-2 gy-2 gy-sm-0">
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
        <span v-else><h4><span class="badge rounded-pill bg-dark me-1" v-for="lineName in selectedProductionLineNameList">{{ lineName }}</span></h4></span>
    </div>

    <div class="modal fade" id="factoryModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content position-relative">
                <div class="position-absolute top-0 end-0 mt-2 me-2 z-1">
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body p-0">
                    <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                        <h4 class="mb-1">Production Line</h4>
                    </div>
                    <div class="p-4">
                        <!-- <div class="form-check mb-0">
                            <input class="form-check-input" id="all-station" type="checkbox" v-model="selectAll"
                                @change="markAllFactories(selectAll)" />
                            <label class="form-check-label" for="all-station">All Stations</label>
                        </div> -->
                        <div v-for="station in stationData">
                            <div class="form-check mb-0" style="margin-left: 23px">
                                {{ station.name }}
                            </div>
                            <div class="form-check mb-0" style="margin-left: 46px" v-for="productionLine in station.production_line">
                                <input class="form-check-input" :id="'line' + productionLine.id" type="radio" :value="productionLine.id" v-model="selectedProductionLineId" />
                                <label class="form-check-label" :for="'line' + productionLine.id">{{ productionLine.name }}</label>
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

    <div class="row g-3">
        <div class="col-6 col-md-3 col-xxl-3 px-2 mb-2">
            <OEEGauge title="OEE" :percentage="averageOee" />
        </div>
        <div class="col-6 col-md-3 col-xxl-3 px-2 mb-2">
            <OEEGauge title="QUALITY" :percentage="qualityOee" />
        </div>
        <div class="col-6 col-md-3 col-xxl-3 px-2 mb-2">
            <OEEGauge title="PERFORMANCE" :percentage="performanceOee" />
        </div>
        <div class="col-6 col-md-3 col-xxl-3 px-2 mb-2">
            <OEEGauge title="AVAILABILITY" :percentage="availabilityOee" />
        </div>
    </div>

    <div class="row mt-1 g-1">
        <div class="col-sm-12 col-lg-11">
            <UnitProducedPage v-if="quality.length > 0" :parent-props="OEEBatches" :date-filter="dateFilter" :selected-production-lines="selectedProductionLines" />
            <div v-else>
                <div class="card-header py-2 text-end" style="background-color: #152b48;">
                    <div class="col-auto align-self-center">
                        <h6 class="text-center text-white mb-0" style="font-size: 16.4px;">UNIT PRODUCED</h6>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body unit">
                        <div class="row g-3">
                            <div class="col-sm-12">
                                <div class="d-flex justify-content-center align-items-center noData">
                                    No data for specific date picked
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-lg-1">
            <div class="card h-100 colorBox">
                <div class="card-body d-flex flex-center flex-column justify-content-center rounded">
                    <h2 class="mb-0">QUALITY</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-1 g-1">
        <div class="col-sm-12 col-lg-11">
            <ShiftPerformance :parent-props="OEEBatches" :date-filter="dateFilter" :selected-production-lines="selectedProductionLines" />
        </div>
        <div class="col-sm-12 col-lg-1">
            <div class="card h-100 colorBox">
                <div class="card-body d-flex flex-center flex-column justify-content-center rounded">
                    <h2 class="mb-0">PERFORMANCE</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-1 g-1">
        <div class="col-sm-12 col-lg-11">
            <DowntimeBarChart :parent-props="OEEBatches" :date-filter="dateFilter" :selected-production-lines="selectedProductionLines" />
        </div>
        <div class="col-sm-12 col-lg-1">
            <div class="card h-100 colorBox">
                <div class="card-body d-flex flex-center flex-column justify-content-center rounded">
                    <h2 class="mb-0">AVAILABILITY</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { snackbar } from '@/components/Snackbar'
import flatpickr from 'flatpickr'
import apiRoute from '@/helpers/ApiHelper'
import dayjs from 'dayjs'
import OEEGauge from '@/views/oee/static-dashboard/oee-indicator/OEEGauge.vue'
import DowntimeBarChart from '@/views/oee/static-dashboard/oee-indicator/DowntimeBarChart.vue'
import ShiftPerformance from '@/views/oee/static-dashboard/oee-indicator/ShiftPerformanceChart.vue'
import UnitProducedPage from '@/views/oee/static-dashboard/oee-indicator/UnitProducedPage.vue'
import ConstantConfig from '@/config/ConstantConfig'
import PageHeaderTitle from '@/views/oee/_shared/PageHeaderTitle.vue'

const cookie = useCookies([
    ConstantConfig.appCookie.oee.oeeIndicatorDateFilter,
    ConstantConfig.appCookie.oee.oeeIndicatorProductionLineFilter,
])

const stationData = ref([])
const factoryList = ref([])
const productionLineList = ref([])
const productionLineNameList = ref([])
const selectedProductionLineNameList = ref([])
const selectedFactory = ref([])
const averageOee = ref(0)
const availabilityOee = ref(0)
const performanceOee = ref(0)
const qualityOee = ref(0)
const OEEBatches = ref([])
const performance = ref([])
const availability = ref([])
const quality = ref([])

const dateFilter = ref(dayjs().format("DD/MM/YYYY"))
const startDate = ref(dayjs().format("YYYY-MM-DD"))
const endDate = ref(dayjs().format("YYYY-MM-DD"))
const productionLinesInput = ref([])
const unconfirmSelectedProductionLines = computed(() =>
    productionLinesInput.value.filter((value) => value != null)
)
const selectedProductionLines = ref([])
const selectAll = ref(false)
const selectedProductionLineId = ref(null)

onMounted(async () => {
    await loadFilterFromCookies()

    flatpickr("#datepicker", {
        mode: "range",
        dateFormat: "d/m/Y",
        defaultDate: [dayjs(startDate.value).format('DD/MM/YYYY'), dayjs(endDate.value).format('DD/MM/YYYY')],
        maxDate: 'today',
        disableMobile: true,
        onChange: async (date) => {
            var datepickerStart = date[0]
            startDate.value = dayjs(datepickerStart).format("YYYY-MM-DD")

            if (date[1]) {
                var datepickerEnd = date[1]
                endDate.value = dayjs(datepickerEnd).format("YYYY-MM-DD")
            }

            if (datepickerStart != undefined && datepickerEnd != undefined) {
                await getBatchOeeList()
                storeFilterDateIntoCookies()
            }
        },
    })

    await getProductionLineAccessData()

    await applyFilter()
})

async function loadFilterFromCookies() {
    // Date filter
    const savedDateFilter = cookie.get(ConstantConfig.appCookie.oee.oeeIndicatorDateFilter)
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

    // Production line filter
    if (cookie.get(ConstantConfig.appCookie.oee.oeeIndicatorProductionLineFilter) != undefined) {
        const lineFromCookies = cookie.get(ConstantConfig.appCookie.oee.oeeIndicatorProductionLineFilter)
        selectedProductionLineId.value = lineFromCookies[0]
    }
}

function storeFilterDateIntoCookies() {
    cookie.set(ConstantConfig.appCookie.oee.oeeIndicatorDateFilter, dateFilter.value)
}

async function showFactoryModal() {
    const myModalEl = document.getElementById("factoryModal")
    const modal = new bootstrap.Modal(myModalEl, {
        keyboard: false,
    })
    modal.show()

    if (stationData.value.length > 0 && stationData.value[0].production_line.length > 0) {
        if (selectedProductionLineId.value === null) {
            selectedProductionLineId.value = stationData.value[0].production_line[0].id
        }
    }

    if (stationData.value.length == 0) {
        await getProductionLineAccessData()
    }
}

async function getProductionLineAccessData() {
    await window.axios
        .get(apiRoute({ name: "api:user_access.production_line_list" }))
        .then(function (response) {
            stationData.value = response.data.data

            stationData.value.forEach((station) => {
                factoryList.value.push(station)

                station.production_line.forEach((prod) => {
                    productionLineList.value.push(prod)
                })
            })

            // Create new list without group
            if (stationData.value.length > 0) {
                var combine = []

                stationData.value.forEach((item) => {
                    var line = item.production_line.map((productionLine) => {
                        return {
                            id: productionLine.id,
                            name: productionLine.name,
                        }
                    })

                    combine = [...line, ...combine]
                })

                productionLineNameList.value = combine
            }
        })
}

async function applyFilter() {
    selectedProductionLines.value = [selectedProductionLineId.value]

    // Show production line name on badge
    const line = productionLineNameList.value.find(item => item.id === selectedProductionLineId.value)
    selectedProductionLineNameList.value = line ? [line.name] : []

    await getBatchOeeList()

    // Store filter in cookies
    if (selectedProductionLineId.value != null) {
        cookie.set(ConstantConfig.appCookie.oee.oeeIndicatorProductionLineFilter, [selectedProductionLineId.value])
    }
}

async function getBatchOeeList() {
    await window.axios.get(apiRoute({ name: 'api_oee:default_dashboard.production_line_oee', query: { start_date: startDate.value, end_date: endDate.value, production_line: selectedProductionLines.value.toString() } }))
    .then(function(response) {
        OEEBatches.value = response.data.data
        performance.value = response.data.data.performance_output
        availability.value = response.data.data.availability_output
        quality.value = response.data.data.quality_output

        averageOee.value = response.data.data.oee
        availabilityOee.value = response.data.data.availability
        performanceOee.value = response.data.data.performance
        qualityOee.value = response.data.data.quality
    })
    .catch(function (error) {
        snackbar('Error on retrieving data!')
    })
}

</script>

<style scoped>
.noData {
    height: 100px;
    font-size: 20px;
    font-weight: bold;
    color: grey;
}
.colorBox {
    background-color: #F8F9FA;
    align-items: center;
}
.card-body.d-flex {
  inline-size: fit-content;
}

[data-bs-theme=light] .colorBox {
    background-color: #F8F9FA;
    align-items: center;
}
[data-bs-theme=dark] .colorBox {
    background-color: #152b48;
    align-items: center;
}

/* xs */
@media (min-width: 576px) {
  .card-body.d-flex {
    writing-mode: horizontal-tb;
  }
}
/* sm */
@media (max-width: 575px) {
  .card-body.d-flex {
    writing-mode: horizontal-tb;
  }
}
/* md */
@media (min-width: 768px) {
  .card-body.d-flex {
    writing-mode: horizontal-tb;
  }
}
/* lg */
@media (min-width: 992px) {
  .card-body.d-flex {
    writing-mode: vertical-rl;
    transform: rotate(-180deg);
  }
}
</style>
