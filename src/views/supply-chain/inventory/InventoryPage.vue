<template>
    <PageHeaderTitle>
        <h5>Inventory</h5>
    </PageHeaderTitle>

    <div class="row g-3 mt-0">
        <!-- left side -->
        <div class="col-sm-12 col-md-9 col-lg-9">
            <div class="card" style="height: 400px;">
                <div class="card-header d-flex align-items-center bg-body-tertiary py-3">
                    <h6 class="mb-0 flex-1 text-center">Stock Location</h6>
                </div>
                <div class="card-body overflow-auto">
                    <div class="d-flex flex-wrap justify-content-center" v-if="stockLocation.length > 0">
                        <div v-for="(stock, index) in stockLocation" :key="index">
                            <div class="card shadow-none m-1" v-if="stock.total_quantity" :style="{ backgroundColor: getBackgroundColor(index, stockLocation.length - 1) }">
                                <div class="card-body"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    data-bs-html="true"
                                    :title="getTooltipContent(stock)">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <p class="text-center">No Record</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- right side -->
        <div class="col-sm-12 col-md-3 col-lg-3">
            <div class="d-flex flex-column" style="height: 400px;">
                <div class="card py-4 h-100 bg-primary text-center mb-3">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="overallCountUpRef">0</span>
                    <h6 class="text-white text-center text-wrap">Overall Quantity</h6>
                </div>
                <div class="card py-4 h-100 bg-danger text-center">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="expiredCountUpRef">0</span>
                    <h6 class="text-white text-center text-wrap">Expired Quantity</h6>
                </div>
                <div class="card py-4 h-100 bg-success text-center mt-3">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="notExpiredCountUpRef">0</span>
                    <h6 class="text-white text-center text-wrap">Not Expired Yet Quantity</h6>
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
                        <ul class="dropdown-menu" v-if="factoriesData.length > 0">
                            <li v-for="(factory, index) in factoriesData" :key="index">
                                <div class="dropdown-item">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="flexRadioDefault" :id="'factory' + index" :value="factory.id" v-model="factoryId" @change="getInventories">
                                        <label class="form-check-label" :for="'factory' + index">
                                            {{ factory.name }}
                                        </label>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul class="dropdown-menu" v-else>
                            <li class="dropdown-item">No Record</li>
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
                            <th scope="col">Material Code</th>
                            <th scope="col">Material Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Material Type</th>
                            <th scope="col">Re-Order Level</th>
                            <th scope="col">Unit of Measurement</th>
                            <th scope="col">Unit Cost</th>
                            <th scope="col">Quantity In</th>
                            <th scope="col">Quantity Out</th>
                            <th scope="col">Date In</th>
                            <th scope="col">Expired Date</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="(inventory, index) in inventoriesData.inventories" :key="index">
                            <th class="text-center">{{ calculateRowNumber(index) }}</th>
                            <td>{{ inventory.material_code }}</td>
                            <td>{{ inventory.material_name }}</td>
                            <td>{{ inventory.description }}</td>
                            <td>{{ inventory.material_type }}</td>
                            <td>{{ inventory.re_order_level }}</td>
                            <td>{{ inventory.unit_of_measurement }}</td>
                            <td>{{ inventory.unit_cost }}</td>
                            <td>{{ inventory.quantity_in }}</td>
                            <td>{{ inventory.quantity_out }}</td>
                            <td>{{ inventory.date_in }}</td>
                            <td>{{ inventory.expired_date }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-4">
                <div class="fw-bold">Show {{ inventoryFrom }} to {{ inventoryTo }} from {{ inventoryTotal }}</div>
                <Bootstrap5Pagination
                    :data="inventoriesData"
                    :limit="3"
                    :show-disabled=true
                    align="right"
                    @pagination-change-page="getInventories"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { CountUp } from 'countup.js'
import { useDebounceFn } from '@vueuse/core'
import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'
import PageHeaderTitle from '@/views/supply-chain/_shared/PageHeaderTitle.vue'

const stockLocation = ref([])

const contentLoader = ref(false)
const search = ref('')

const inventoriesData = ref({})
const currentPage = ref(1)
const itemsPerPage = ref(0)
const inventoryFrom = ref(0)
const inventoryTo = ref(0)
const inventoryTotal = ref(0)

const factoriesData = ref({})
const factoryId = ref(0)
const factoryName = ref('')

const overallQuantity = ref(0)
const expiredQuantity = ref(0)
const notExpiredQuantity = ref(0)

const overallCountUpRef = ref(null)
const expiredCountUpRef = ref(null)
const notExpiredCountUpRef = ref(null)
let overallCountUp
let expiredCountUp
let notExpiredCountUp

onMounted(async () => {
    await getFactories()
    contentLoader.value = true
    await getInventories()
    contentLoader.value = false

    initializeTooltips()
    initializeCounters()
    updateCountersWithRandomValues()
    setInterval(() => {
        updateCountersWithRandomValues()
    }, 3000)
})

watch(stockLocation, async () => {
    await nextTick()
    initializeTooltips()
})

const debounceSearch = useDebounceFn(() => {
    getInventories()
}, 500)

// Function to calculate the background color based on the rank
function getBackgroundColor(index, totalItems) {
    // Normalize the index to a value between 0 and 1
    const ratio = index / totalItems
    // Interpolate between two colors (dark to bright)
    const startColor = [255, 99, 41] // dark
    const endColor = [255, 218, 205] // bright
    const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]))
    const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]))
    const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]))
    return `rgb(${r}, ${g}, ${b})`
}

const getInventories = async (page = 1) => {
    try {
        const response = await window.axios.get(apiRoute({ name : 'api_spc:get_inventories', query: { factory: factoryId.value, search: search.value, page: page } }))

        if (response.data.status == true) {
            inventoriesData.value = response.data.data

            stockLocation.value = response.data.data.stock_location

            inventoryFrom.value = response.data.data.meta.from
            inventoryTo.value = response.data.data.meta.to
            inventoryTotal.value = response.data.data.meta.total
            itemsPerPage.value = response.data.data.meta.per_page
            currentPage.value = response.data.data.meta.current_page

            overallQuantity.value = response.data.data.overall_inventories_quantity
            expiredQuantity.value = response.data.data.expired_inventories_quantity
            notExpiredQuantity.value = response.data.data.not_expired_inventories_quantity

            factoryName.value = response.data.data.factory_name
        }
    } catch (e) {
        snackbar('Unexpected error while fetching inventories data.')
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
    overallCountUp = new CountUp(overallCountUpRef.value, 0)
    expiredCountUp = new CountUp(expiredCountUpRef.value, 0)
    notExpiredCountUp = new CountUp(notExpiredCountUpRef.value, 0)

    overallCountUp.start()
    expiredCountUp.start()
    notExpiredCountUp.start()
}

function updateCountersWithRandomValues() {
    overallCountUp.update(overallQuantity.value)
    expiredCountUp.update(expiredQuantity.value)
    notExpiredCountUp.update(notExpiredQuantity.value)
}

// Function to initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = Array.from(tooltipTriggerList).map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

const getTooltipContent = (stock) => {
    return `
        <div class="text-start">
            <span>Material Code: ${stock.material_code}</span>
            <span>Material Name: ${stock.material_name}</span>
            <span>Total Quantity: ${stock.total_quantity}</span>
        </div>
    `
}
</script>
