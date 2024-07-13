<template>
    <PageHeaderTitle>
        <h5>Batch OEE</h5>
    </PageHeaderTitle>

    <div class="row mt-2 mb-3 gy-2 gy-sm-0">
        <div class="col-md-3 col-lg-4 col-xxl-6"></div>
        <div class="col-12 col-sm-6 col-md-5 col-lg-4 col-xxl-3 pe-sm-2">
            <input class="form-control datetimepicker" id="datepicker" type="text" v-model="dateFilter"
                placeholder="Date" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xxl-3 ps-sm-2">
            <input class="form-control" type="text" placeholder="Factories" readonly style="cursor: pointer"
                @click="showFactoryModal()" />
        </div>
    </div>

    <div class="d-flex align-items-center">
        <span class="h5 me-2">Filters by: </span>
        <span class="badge rounded-pill bg-primary" v-if="selectedProductionLines.length == 0">All Production Line</span>
        <span v-else><h4><span class="badge rounded-pill bg-dark me-1" v-for="lineName in selectedProductionLineNameList">{{ lineName }}</span></h4></span>
    </div>

    <div class="modal fade" id="factoryModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content position-relative">
                <div class="position-absolute top-0 end-0 mt-2 me-2 z-1">
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                        <h4 class="mb-1">Production Line</h4>
                    </div>
                    <div class="p-4">
                        <div class="form-check mb-0">
                            <input class="form-check-input" id="all-station" type="checkbox" v-model="selectAll"
                                @change="markAllFactories(selectAll)" />
                            <label class="form-check-label" for="all-station">All Stations</label>
                        </div>
                        <div v-for="station in stationData">
                            <div class="form-check mb-0" style="margin-left: 23px">
                                <input class="form-check-input" :id="'station' + station.id" type="checkbox"
                                    :true-value="station.id" :false-value="null" v-model="selectedFactory[station.id]"
                                    @change="markAllProductionLines(station.id)" />
                                <label class="form-check-label" :for="'station' + station.id">{{ station.name }}</label>
                            </div>
                            <div class="form-check mb-0" style="margin-left: 46px"
                                v-for="productionLine in station.production_line">
                                <input class="form-check-input" :id="'line' + productionLine.id" type="checkbox"
                                    :true-value="productionLine.id" :false-value="null"
                                    v-model="productionLinesInput[productionLine.id]" />
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

    <div>
        <component :is="currentView" :paginated-data="paginatedData" :calculate-index="calculateIndex" />
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center mt-4">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="prevPage">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
                    <a class="page-link" href="#" @click.prevent="gotoPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="nextPage">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, defineAsyncComponent, onUnmounted } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { snackbar } from '@/components/Snackbar'
import flatpickr from 'flatpickr'
import apiRoute from '@/helpers/ApiHelper'
import dayjs from 'dayjs'
import ConstantConfig from '@/config/ConstantConfig'
import PageHeaderTitle from '@/views/oee/_shared/PageHeaderTitle.vue'

const TableView = defineAsyncComponent(() => import('@/views/oee/static-dashboard/batch-oee/TableView.vue'))
const ListView = defineAsyncComponent(() => import('@/views/oee/static-dashboard/batch-oee/ListView.vue'))

const cookie = useCookies([
    ConstantConfig.appCookie.oee.oeeBatchDateFilter,
    ConstantConfig.appCookie.oee.oeeBatchProductionLineFilter
])

const stationData = ref([])
const factoryList = ref([])
const productionLineList = ref([])
const productionLineNameList = ref([])
const selectedProductionLineNameList = ref([])
const selectedFactory = ref([])
const batchOEEData = ref([])

const dateFilter = ref(dayjs().format('DD/MM/YYYY'))
const startDate = ref(dayjs().format('YYYY-MM-DD'))
const endDate = ref(dayjs().format('YYYY-MM-DD'))
const productionLinesInput = ref([])
const unconfirmSelectedProductionLines = computed(() => productionLinesInput.value.filter((value) => value != null))
const selectedProductionLines = ref([])
const selectAll = ref(false)

const currentPage = ref(1)
const itemsPerPage = 25
const totalItems = computed(() => batchOEEData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const batchNumberIndexMap = ref({})

const width = ref(window.innerWidth)
const updateWidth = () => {
    width.value = window.innerWidth
}
const currentView = computed(() => width.value <= 991.98 ? ListView : TableView)

watch(selectedProductionLines, async () => {
    // Clear the batch number index map to recalculate indices
    batchNumberIndexMap.value = {}
})

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
                await getBatchOEEList()
                storeFilterDateIntoCookies()
            }
        }
    })

    await getProductionLineAccessData()

    await applyFilter()

    window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})

async function loadFilterFromCookies() {
    // Date filter
    const savedDateFilter = cookie.get(ConstantConfig.appCookie.oee.oeeBatchDateFilter)
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
    const lineFromCookies = cookie.get(ConstantConfig.appCookie.oee.oeeBatchProductionLineFilter)
    if (lineFromCookies) {
        lineFromCookies.forEach(item => {
            productionLinesInput.value[item] = item
        })
    }

    await applyFilter()
}

function storeFilterDateIntoCookies() {
    cookie.set(ConstantConfig.appCookie.oee.oeeBatchDateFilter, dateFilter.value)
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
        .then(function (response) {
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
}

async function applyFilter() {
    selectedProductionLines.value = unconfirmSelectedProductionLines.value

    // Show production line name on badge
    var filteredName = productionLineNameList.value.filter((item) => {
        return selectedProductionLines.value.includes(item.id)
    })
    filteredName = JSON.parse(JSON.stringify(filteredName))
    filteredName = filteredName.sort((a, b) => a.name.localeCompare(b.name)).map(value => value.name)

    selectedProductionLineNameList.value = filteredName

    await getBatchOEEList()

    // Store filter in cookies
    if (selectedProductionLines.value.length > 0) {
        cookie.set(ConstantConfig.appCookie.oee.oeeBatchProductionLineFilter, selectedProductionLines.value)
    }
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

async function getBatchOEEList() {
    await window.axios.get(apiRoute({ 
        name: 'api_oee:default_dashboard.batch_oee', 
        query: { 
            start_date: startDate.value, 
            end_date: endDate.value, 
            production_line: selectedProductionLines.value.toString() 
        } }))
        .then(response => {
            batchOEEData.value = response.data.data
            recalculateIndices()
        })
        .catch(function (error) {
            snackbar('Error on retrieving data!')
        })
}

function formatDate(dateTime) {
    if (!dateTime || !dayjs(dateTime).isValid()) {
        return '-'
    } else {
        return dayjs(dateTime).format('DD/MM/YYYY hh:mm A')
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

function gotoPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

//slice the data for the current page
const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return batchOEEData.value.slice(startIndex, endIndex)
})

const calculateIndex = (batchNumber) => {
    // Initialize index for the batch number if not already present
    if (!batchNumberIndexMap[batchNumber]) {
        batchNumberIndexMap[batchNumber] = Object.keys(batchNumberIndexMap).length + 1
    }
    return batchNumberIndexMap[batchNumber]
}

const recalculateIndices = () => {
    const existingBatchNumbers = new Set()
    let index = 1
    batchOEEData.value.forEach(batch => {
        if (!existingBatchNumbers.has(batch.batch_number)) {
            existingBatchNumbers.add(batch.batch_number)
            batchNumberIndexMap[batch.batch_number] = index
            index++
        }
    })
}
</script>

<style lang="css" scoped>
.machineBorder{
    border-right: 1px solid rgba(0, 0, 0, 0.068);
}
</style>