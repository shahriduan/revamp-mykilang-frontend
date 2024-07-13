<template>
    <PageHeaderTitle>
        <h5>
            <i class="fa-solid fa-circle fa-sm text-danger"></i> 
            Live Operation 
            <span>({{ currentTime }})</span>
        </h5>
    </PageHeaderTitle>

    <div class="row my-2">
        <div class="col-12 col-lg-7 col-xl-8">
            <span class="h5">Filters by: </span>
            <h4 class="d-inline me-2">
                <span class="badge badge-subtle-primary rounded-pill">Production Line: {{ filtersByProductionLineName }}</span>
            </h4>
            <h4 class="d-inline me-2">
                <span class="badge badge-subtle-primary rounded-pill">Machine: {{ selectedMachineData.machine_name }}</span>
            </h4>
        </div>
        <div class="col-12 col-lg-5 col-xl-4 mt-2 mt-lg-0">
            <div class="d-lg-flex justify-content-end">
                <button class="btn btn-falcon-default position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
                Filter <i class="fa-solid fa-filter"></i>
                </button>
                <div class="offcanvas offcanvas-end" id="offcanvasRight" tabindex="-1" aria-labelledby="offcanvasRightLabel">
                    <div class="offcanvas-header">
                        <h5 id="offcanvasRightLabel">Production Line</h5>
                        <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <div v-for="station in stationData" v-if="stationData.length > 0">
                            <p class="mb-1">{{ station.name }}</p>
                            <div class="form-check mb-0" style="margin-left: 15px" v-for="productionLine in station.production_line">
                                <input
                                    class="form-check-input"
                                    :id="'production-line-' + productionLine.id"
                                    type="radio"
                                    name="production_line"
                                    v-model="productionLinesInput"
                                    :value="productionLine.id"
                                    @change="getLiveOperationData(true)"
                                />
                                <label class="form-check-label" :for="'production-line-' + productionLine.id">{{ productionLine.name }}</label>
                            </div>
                        </div>
                        <div class="alert alert-info" role="alert" v-else>
                            No production line available.
                        </div>
                    </div>
                </div>
                <button class="btn btn-falcon-default ms-2 position-relative" type="button" @click="setArrangementOfMachine(nextIndexData)">
                    {{ nextMachineData?.machine_name }}
                    <i class="fas fa-arrow-right ms-1"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="row" v-if="stationData.length > 0">
        <div class="col-12 col-xxl-3">
            <div class="row">
                <div class="col-6 col-md-3 col-xxl-12 px-2 mb-2">
                    <OEEGauge title="OEE" :percentage="selectedMachineData.oee_percent" />
                </div>
                <div class="col-6 col-md-3 col-xxl-12 px-2 mb-2">
                    <OEEGauge title="Availability" :percentage="selectedMachineData.availability_percent" />
                </div>
                <div class="col-6 col-md-3 col-xxl-12 px-2 mb-2">
                    <OEEGauge title="Performance" :percentage="selectedMachineData.performance_percent" />
                </div>
                <div class="col-6 col-md-3 col-xxl-12 px-2 mb-2">
                    <OEEGauge title="Quality" :percentage="selectedMachineData.quality_percent" />
                </div>
            </div>
        </div>
        <div class="col-12 col-xxl-9">
            <div class="row gy-3 mb-3">
                <div class="col-12 col-md-12 col-lg-4">
                    <div class="card">
                        <h5 class="card-title card-header text-center py-2" style="background-color: #0967F3">DETAILS</h5>
                        <div class="card-body p-0">
                            <div style="background-color: blue">
                                <div class="px-3 py-3">
                                    <div class="d-flex flex-column mb-3 text-white">
                                        <div class="fs--1 fw-bold">Shift</div>
                                        <div>{{ selectedMachineData.shift ?? '---' }}</div>
                                    </div>
                                    <div class="d-flex flex-column mb-3 text-white">
                                        <div class="fs--1 fw-bold">Product</div>
                                        <div>{{ selectedMachineData.product ?? '---' }}</div>
                                    </div>
                                    <div class="d-flex flex-column text-white">
                                        <div class="fs--1 fw-bold">Model</div>
                                        <div>{{ selectedMachineData.shift ?? '---' }}</div>
                                    </div>
                                </div>
                            </div>
                            <div style="background-color: rgb(16, 206, 16)">
                                <div class="px-3 py-3">
                                    <div class="d-flex justify-content-between text-white">
                                        <div class="fs-0 fw-bold align-self-center">Plan Quantity</div>
                                        <div class="align-self-center">{{ selectedMachineData.plan_quantity }}</div>
                                    </div>
                                </div>
                            </div>
                            <div style="background-color: brown; border-radius: 0px 0px 0.375rem 0.375rem">
                                <div class="px-3 py-3">
                                    <div class="d-flex justify-content-between text-white">
                                        <div class="fs-0 fw-bold align-self-center">Actual Quantity</div>
                                        <div class="align-self-center">{{ selectedMachineData.actual_quantity }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card">
                        <h5 class="card-title card-header text-center py-2" style="background-color: #0967F3">STATUS</h5>
                        <div class="card-body p-0">
                            <div :style="{ 'background-color': selectedMachineData && selectedMachineData.machine_is_downtime == true ? '#C10017' : '#1EA908' }" style="border-radius: 0px 0px 0.375rem 0.375rem" class="h-100">
                                <div class="px-3 py-3">
                                    <div class="d-flex flex-column text-white">
                                        <i class="bi bi-gear text-center" style="color: white; font-size: 60px" v-if="selectedMachineData.machine_is_active == true"></i>
                                        <i class="bi bi-stop-circle text-center" style="color: white; font-size: 60px" v-else></i>
                                        <h5 class="status-downtime">{{ selectedMachineData.machine_is_active == true ? 'RUNNING' : 'NOT STARTED' }}</h5>
                                        <p class="text-center" style="font-weight: bold; color: white">{{ selectedMachineData.planner_status }}</p>
                                        <div class="d-flex justify-content-evenly">
                                            <div class="mb-3">
                                                <div class="fs--1 fw-bold text-center">Start Time</div>
                                                <div class="text-center">{{ selectedMachineData.start_time ?? '---' }}</div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-evenly">
                                            <div class="mb-3">
                                                <div class="fs--1 fw-bold text-center">Run Time</div>
                                                <div class="text-center">{{ selectedMachineData.run_time }}</div>
                                            </div>
                                            <div class="mb-3">
                                                <div class="fs--1 fw-bold text-center">UPH (Unit/Hour)</div>
                                                <div class="text-center">{{ selectedMachineData.uph }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card">
                        <h5 class="card-title card-header text-center py-2" style="background-color: #0967F3">DOWNTIME</h5>
                        <div class="card-body p-0">
                            <div :style="{ 'background-color': selectedMachineData && selectedMachineData.machine_is_downtime == true ? '#C10017' : '#1EA908' }" style="border-radius: 0px 0px 0.375rem 0.375rem" class="h-100">
                                <div class="px-3 py-3">
                                    <div class="d-flex flex-column text-white">
                                        <i class="bi bi-tools text-center" style="color: white; font-size: 60px" v-if="selectedMachineData.machine_is_downtime == true"></i>
                                        <i class="bi bi-hand-thumbs-up text-center" style="color: white; font-size: 60px" v-else></i>
                                        <h5 class="status-downtime">{{ selectedMachineData.machine_is_downtime == true ? selectedMachineData.downtime_status : 'HEALTHY' }}</h5>
                                        <p class="text-center" style="font-weight: bold; color: white">Problem: {{ selectedMachineData.downtime_problem ?? 'OK' }}</p>
                                        <div class="d-flex justify-content-evenly">
                                            <div class="mb-3">
                                                <div class="fs--1 fw-bold text-center">Start Time</div>
                                                <div class="text-center">{{ selectedMachineData.downtime_start ?? '---' }}</div>
                                            </div>
                                            <div class="mb-3">
                                                <div class="fs--1 fw-bold text-center">Duration</div>
                                                <div class="text-center">{{ selectedMachineData.duration ?? '---' }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <TEEPScoresWidget :effectiveness="selectedMachineData?.effectiveness" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="alert alert-info" role="alert" v-else>
        No production line available.
    </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import apiRoute from '@/helpers/ApiHelper'
import PageHeaderTitle from '@/views/oee/_shared/PageHeaderTitle.vue'
import OEEGauge from '@/views/oee/realtime-dashboard/live-operation/OEEGauge.vue'
import TEEPScoresWidget from '@/views/oee/realtime-dashboard/live-operation/TEEPScoresWidget.vue'

const intervalId = ref(null)
const currentTime = ref()
const stationData = ref([])
const productionLinesInput = ref(null)
const productionLineWithoutGroup = ref([])

/* Output Data */
const liveData = ref([])
const totalMachines = ref(0) // Total machines in production line
const previousIndexData = ref(0) // Previous of live data array
const currentIndexLiveData = ref(0) // Index of live data array
const nextIndexData = ref(0) // Next of live data array
const selectedMachineData = ref({}) // Object of machine live data
const previousMachineData = ref({})
const nextMachineData = ref({})

/* UI */
const filtersByProductionLineName = ref() // Production line name after filter

onMounted(async () => {
    useIntervalFn(() => {
        currentTime.value = dayjs().format('dddd, DD/MM/YYYY, hh:mm:ss A')
    }, 1000, {
        immediateCallback: true
    })  

    await getProductionLineAccessData()

    if (productionLinesInput.value != null) {
        await getLiveOperationData()

        intervalId.value = setInterval(async function() {
            await getLiveOperationData()
        }, 30000)
    }
})

onBeforeUnmount(() => {
    clearInterval(intervalId.value)
})

async function getProductionLineAccessData() {
    await window.axios.get(apiRoute({ name: 'api:user_access.production_line_list' }))
        .then(function(response) {
            stationData.value = response.data.data

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

                    productionLineWithoutGroup.value = [...line, ...combine]
                })

                productionLinesInput.value = productionLineWithoutGroup.value.length > 0 ? productionLineWithoutGroup.value[0].id : null // Set default value ID
            }
        })
}

async function getLiveOperationData(resetCurrentIndex = false) {
    if (resetCurrentIndex == true) {
        currentIndexLiveData.value = 0 // Reset current index
    }

    await window.axios.get(apiRoute({ name: 'api_oee:live_operation', query: { production_line: productionLinesInput.value } }))
        .then(function(response) {
            var apiData = response.data.data

            filtersByProductionLineName.value = apiData.production_line
            totalMachines.value = apiData.live.length
            liveData.value = apiData.live

            if (liveData.value.length > 0) {
                setArrangementOfMachine(currentIndexLiveData.value)
            }
        })
}

function setArrangementOfMachine(currentIndex) {
    selectedMachineData.value = liveData.value[currentIndex]
    currentIndexLiveData.value = currentIndex
    var totalIndex = liveData.value.length - 1 // Last index

    if (totalMachines.value > 1) {
        if (currentIndex == 0) {
            previousIndexData.value = totalIndex
            previousMachineData.value = liveData.value[totalIndex]

            nextIndexData.value = currentIndex + 1
            nextMachineData.value = liveData.value[currentIndex + 1]
        } else {
            previousIndexData.value = currentIndex - 1
            previousMachineData.value = liveData.value[currentIndex - 1]

            nextIndexData.value = 0
            nextMachineData.value = liveData.value[0]
        }
    } else {
        previousMachineData.value = {}
        nextMachineData.value = {}
    }
}
</script>

<style scoped>
.status-downtime {
    font-size: x-large;
    color: azure;
    text-align: center;
    margin: 5px;
}
.card-text {
    font-size: small;
    font-weight: bold;
    color: white;
}
.card-title {
    color: white;
}
.card {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>