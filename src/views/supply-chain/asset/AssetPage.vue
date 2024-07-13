<template>
    <PageHeaderTitle>
        <h5>Asset</h5>
    </PageHeaderTitle>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mt-0 text-center">
        <!-- <div class="col">
            <div class="card w-100 h-100 bg-light">
                <div class="card-body">
                    <div style="min-height: 200px; width: 100%;" class="max-w-100" ref="doughnutChart"></div>
                </div>
            </div>
        </div> -->
        <div class="col">
            <div class="card w-100 h-100 bg-primary">
                <div class="card-body py-4">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="assetsCountUpRef">0</span>
                    <h6 class="text-white">Total Asset</h6>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="card w-100 h-100 bg-success">
                <div class="card-body py-4">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="availableCountUpRef">0</span>
                    <h6 class="text-white">Asset Available</h6>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="card w-100 h-100 bg-danger">
                <div class="card-body py-4">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="isolatedCountUpRef">0</span>
                    <h6 class="text-white">Asset Isolated</h6>
                </div>
            </div>
        </div>
    </div>

    <div class="card mt-3">
        <div class="card-body">
            <div class="d-flex mb-4">
                <div class="input-group me-3">
                    <span class="input-group-text" id="search"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <input type="text" class="form-control" placeholder="Search" aria-label="Seacrh" aria-describedby="search" v-model="search" @keyup="debounceSearch">
                </div>
                <div>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-buildings me-2"></i>Factory
                        </button>
                        <ul class="dropdown-menu">
                            <li v-for="(factory, index) in factoriesData" :key="index">
                                <div class="dropdown-item">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="flexRadioDefault" :id="'factory' + index" :value="factory.id" v-model="factoryId" @change="getAssets">
                                        <label class="form-check-label" :for="'factory' + index">
                                            {{ factory.name }}
                                        </label>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <span class="fw-bold">{{ factoryName }}</span>
            </div>

            <CircleSpinner class="mt-5" v-if="contentLoader == true" />

            <div class="table-responsive" v-if="contentLoader == false">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" class="text-center">#</th>
                            <th scope="col">Equipment Type</th>
                            <th scope="col">Equipment Code</th>
                            <th scope="col">Serial Number</th>
                            <th scope="col">Production Line</th>
                            <th scope="col">Process List</th>
                            <th scope="col">Model</th>
                            <th scope="col">Last Calibration Date</th>
                            <th scope="col">Next Calibration</th>
                            <th scope="col">Calibration Interval</th>
                            <th scope="col">Equipment Status</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="(asset, index) in assetsData.assets" :key="index">
                            <th class="text-center">{{ calculateRowNumber(index) }}</th>
                            <td>{{ asset.equipment_type }}</td>
                            <td>{{ asset.equipment_code }}</td>
                            <td>{{ asset.serial_number }}</td>
                            <td>{{ asset.production_line }}</td>
                            <td>{{ asset.process_list }}</td>
                            <td>{{ asset.model }}</td>
                            <td>{{ asset.last_calibration_date }}</td>
                            <td>{{ asset.next_calibration_date }}</td>
                            <td>{{ asset.calibration_interval }}</td>
                            <td>
                                <span v-if="asset.status_category === 'Available'" class="badge fw-semi-bold rounded-pill badge-subtle-success">{{ asset.equipment_status }}</span>
                                <span v-else class="badge fw-semi-bold rounded-pill badge-subtle-danger">{{ asset.equipment_status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-4">
                <div class="fw-bold">Show {{ assetFrom }} to {{ assetTo }} from {{ assetTotal }}</div>
                <Bootstrap5Pagination
                    :data="assetsData"
                    :limit="3"
                    :show-disabled=true
                    align="right"
                    @pagination-change-page="getAssets"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { show } from 'node-snackbar'
import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import { CountUp } from 'countup.js'
import { useDebounceFn } from '@vueuse/core'
import { snackbar } from '@/components/Snackbar'
import * as echarts from 'echarts'
import apiRoute from '@/helpers/ApiHelper'
import PageHeaderTitle from '@/views/supply-chain/_shared/PageHeaderTitle.vue'
import CircleSpinner from '@/components/CircleSpinner.vue'

const factoriesData = ref({})
const assetsData = ref({})
const totalAssets = ref(0)
const availableAssets = ref(0)
const isolatedAssets = ref(0)

const contentLoader = ref(false)
const search = ref('')
const factoryId = ref(0)
const factoryName = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(0)
const assetFrom = ref(0)
const assetTo = ref(0)
const assetTotal = ref(0)

const assetsCountUpRef = ref(null)
const availableCountUpRef = ref(null)
const isolatedCountUpRef = ref(null)
let assetsCountUp
let availableCountUp
let isolatedCountUp

const debounceSearch = useDebounceFn(async () => {
    getAssets()
}, 500)

onMounted(async () => {
    await getFactories()

    contentLoader.value = true
    await getAssets()
    contentLoader.value = false

    initializeCounters()

    updateCountersWithRandomValues()

    setInterval(() => {
        updateCountersWithRandomValues()
    }, 3000)

    // createDoughnutChart()
})

const getAssets = async (page = 1) => {
    try {
        const response = await window.axios.get(apiRoute({ name : 'api_spc:get_assets', query: { factory: factoryId.value, search: search.value, page: page } }))

        if (response.data.status == true) {
            assetsData.value = response.data.data
            totalAssets.value = response.data.data.total_assets_count
            availableAssets.value = response.data.data.available_assets_count
            isolatedAssets.value = response.data.data.isolated_assets_count

            assetFrom.value = response.data.data.meta.from
            assetTo.value = response.data.data.meta.to
            assetTotal.value = response.data.data.meta.total
            itemsPerPage.value = response.data.data.meta.per_page
            currentPage.value = response.data.data.meta.current_page

            factoryName.value = response.data.data.factory_name
        }
    } catch (e) {
        snackbar('Unexpected error while fetching assets data.')
    }
}

async function getFactories() {
    try {
        const response = await window.axios.get(apiRoute({ name: 'api:factory.list' }))

        if (response.data.status == true) {
            factoriesData.value = response.data.data
            factoryId.value = response.data.data[0].id // set default factory id to show data
            factoryName.value = response.data.data[0].name
        }
    } catch (e) {
        snackbar('Unexpected error while fetching factories data.')
    }
}

// Function to calculate the starting row number for the current page
const calculateStartingRowNumber = () => {
    return (currentPage.value - 1) * itemsPerPage.value + 1;
}

// Function to calculate the row number for each asset based on its index
const calculateRowNumber = (index) => {
    return calculateStartingRowNumber() + index;
}

// Funtions for count animation on total, available, and isolated assets
function initializeCounters() {
    assetsCountUp = new CountUp(assetsCountUpRef.value, 0)
    availableCountUp = new CountUp(availableCountUpRef.value, 0)
    isolatedCountUp = new CountUp(isolatedCountUpRef.value, 0)

    assetsCountUp.start()
    availableCountUp.start()
    isolatedCountUp.start()
}

function updateCountersWithRandomValues() {
    assetsCountUp.update(totalAssets.value)
    availableCountUp.update(availableAssets.value)
    isolatedCountUp.update(isolatedAssets.value)
}

// Sample data for the doughnut chart
// const doughnutChartData = {
//     labels: ['Asset Available', 'Asset Isolated', 'Asset Dispatch'],
//     data: [8, 4, 2], // Sample data values
//     colors: ['#CEB6F4', '#7A2AFB', '#360880'] // Colors for each section
// }

// const doughnutChart = ref(null)

// // Function to create and render the doughnut chart
// const createDoughnutChart = () => {
//     const chart = echarts.init(doughnutChart.value)

//     const option = {
//         tooltip: {
//             trigger: 'item',
//             formatter: '{a} <br/>{b}: {c} ({d}%)'
//         },
//         legend: {
//             orient: 'vertical',
//             left: 10,
//             data: doughnutChartData.labels,
//             show: false
//         },
//         series: [
//             {
//                 name: 'Assets',
//                 type: 'pie',
//                 radius: ['45%', '70%'],
//                 avoidLabelOverlap: false,
//                 label: {
//                     show: false,
//                     position: 'center'
//                 },
//                 emphasis: {
//                     label: {
//                         show: true,
//                         fontSize: '20',
//                         fontWeight: 'bold'
//                     }
//                 },
//                 labelLine: {
//                     show: false
//                 },
//                 data: doughnutChartData.labels.map((label, index) => ({
//                     value: doughnutChartData.data[index],
//                     name: label,
//                     itemStyle: {
//                         color: doughnutChartData.colors[index]
//                     }
//                 }))
//             }
//         ]
//     }

//     chart.setOption(option)
// }
</script>
