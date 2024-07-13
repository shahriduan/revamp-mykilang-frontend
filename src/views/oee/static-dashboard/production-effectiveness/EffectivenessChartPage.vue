<template>
    <PageHeaderTitle>
        <h5>Machine Effectiveness</h5>
    </PageHeaderTitle>

    <div class="row mt-2 mb-1 gy-1 gy-sm-0">
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
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                        <h4 class="mb-1">Production Line</h4>
                    </div>
                    <div class="p-4">
                        <div v-for="station in stationData">
                            <div class="mb-0" style="margin-left: 23px">
                                {{ station.name }}
                            </div>
                            <div v-for="productionLine in station.production_line">
                                <div class="form-check mb-0" style="margin-left: 23px">
                                    <input class="form-check-input" :id="'line' + productionLine.id" type="radio" :value="productionLine.id" v-model="selectedProductionLineId">
                                    <label class="form-check-label" :for="'line' + productionLine.id">{{ productionLine.name }}</label>
                                </div>
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

    <div class="row">
        <!-- left side -->
        <div class="col-sm-4 col-lg-3 border-end scroll scroll4">
            <div class="row mt-1 mb-2">
                <div class="d-grid gap-2">
                    <button class="btn btn-falcon-default" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft">
                        Products and Shifts <i class="fa-solid fa-filter"></i>
                    </button>
                </div>

                <div class="offcanvas offcanvas-start" id="offcanvasLeft" tabindex="-1" aria-labelledby="offcanvasLeftLabel">
                    <div class="offcanvas-header">
                        <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <div class="form-check mb-0" style="margin-left: 15px">
                            <h5 style="margin-left: -35px">Products</h5>
                            <div class="form-check mb-0" style="margin-left: -20px" v-for="part in partsData" v-if="partsData != 0">
                                <input class="form-check-input" :id="'part' + part.part_id" type="checkbox" :true-value="part.part_id" :false-value="null" v-model="selectedPartIds[part.part_id]" />
                                <label class="form-check-label" :for="'part' + part.part_id">{{ part.part_name }} {{ part.model_name }}</label>
                            </div>
                            <div class="alert alert-info" role="alert" v-else>
                                No products available.
                            </div>

                            <h5 class="mt-2" style="margin-left: -35px">Shifts</h5>
                            <div class="form-check mb-0" style="margin-left: -20px" v-for="shift in shiftsData" v-if="shiftsData != 0">
                                <input class="form-check-input" :id="'shift' + shift.shift_id" type="checkbox" :true-value="shift.shift_id" :false-value="null" v-model="selectedShiftIds[shift.shift_id]" />
                                <label class="form-check-label" :for="'shift' + shift.shift_id">{{ shift.shift_name }}</label>
                            </div>
                            <div class="alert alert-info" role="alert" v-else>
                                No shifts available.
                            </div>
                        </div>
                    </div>
                    <div class="offcanvas-footer d-flex justify-content-end p-3">
                        <button class="btn btn-secondary me-2" type="button" data-bs-dismiss="offcanvas">Close</button>
                        <button class="btn btn-primary" type="button" data-bs-dismiss="offcanvas" @click="applyProductShiftFilter">Apply Filter</button>
                    </div>
                </div>

            </div>
            <div class="card-body mt-1">
                <div class="text-light" v-if="filteredParts.length > 0">
                    <h5 class="card-header p-1" style="background-color: #0967F3;">Products</h5>
                    <ol style="background-color: #0822A9;">
                        <div v-for="part in filteredParts" :key="part.part_id">
                            <li>{{ part.part_name }} {{ part.model_name }}</li>
                        </div>
                    </ol>
                </div>
                <div class="text-light" v-else>
                    <h5 class="card-header p-1" style="background-color: #0967F3;">Products</h5>
                    <ol style="background-color: #0822A9;">
                        <div v-for="part in partsData" :key="part.part_id">
                            <li>{{ part.part_name }} {{ part.model_name }}</li>
                        </div>
                    </ol>
                </div>
            </div>
            <div class="card-body mt-1">
                <div class="text-light" v-if="filteredShifts.length > 0">
                    <h5 class="card-header p-1" style="background-color: #0967F3;">Shifts</h5>
                    <ol style="background-color: #0822A9;">
                        <div v-for="shift in filteredShifts" :key="shift.shift_id">
                            <li>{{ shift.shift_name }}</li>
                        </div>
                    </ol>
                </div>
                <div class="text-light" v-else>
                    <h5 class="card-header p-1" style="background-color: #0967F3;">Shifts</h5>
                    <ol style="background-color: #0822A9;">
                        <div v-for="shift in shiftsData" :key="shift.shift_id">
                            <li>{{ shift.shift_name }}</li>
                        </div>
                    </ol>
                </div>
            </div>
            <div class="card-body mt-2">
                <div>
                    <div class="text-light p-1" style="background-color: #00A424;">Unit Produced: <span class="fw-medium h4 text-light">{{ totalProduced }}</span></div>
                </div>
            </div>
            <div class="card-body mt-2">
                <div>
                    <div class="text-light p-1" style="background-color: #C10017;">Unit Rejected: <span class="fw-medium h4 text-light">{{ totalRejected }}</span></div>
                </div>

            </div>
        </div>
        <!-- right side -->
        <div class="col-sm-8 col-lg-9">
            <EffectivenessChartWidget :parent-props="paginatedMachinesData"/>
        </div>
    </div>

    <nav aria-label="Pagination">
        <ul class="pagination justify-content-center mt-3">
            <li class="page-item" :class="{ disabled: page === 1 }">
                <button class="page-link" @click="previousPage" :disabled="page === 1">Previous</button>
            </li>
            <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber" :class="{ active: page === pageNumber }">
                <button class="page-link" @click="goToPage(pageNumber)">{{ pageNumber }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
                <button class="page-link" @click="nextPage" :disabled="page === totalPages">Next</button>
            </li>
        </ul>
    </nav>

</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { snackbar } from '@/components/Snackbar'
import flatpickr from 'flatpickr'
import apiRoute from '@/helpers/ApiHelper'
import dayjs from 'dayjs'
import ConstantConfig from '@/config/ConstantConfig'
import PageHeaderTitle from '@/views/oee/_shared/PageHeaderTitle.vue'
import EffectivenessChartWidget from '@/views/oee/static-dashboard/production-effectiveness/EffectivenessChartWidget.vue'

const cookie = useCookies([
    ConstantConfig.appCookie.oee.effectivenessDateFilter,
    ConstantConfig.appCookie.oee.effectivenessProductionLineFilter
])

const stationData = ref([])
const factoryList = ref([])
const productionLineList = ref([])
const productionLineNameList = ref([])
const selectedProductionLineNameList = ref([])
const effectivenessData = ref([])

const dateFilter = ref(dayjs().format('DD/MM/YYYY'))
const startDate = ref(dayjs().format('YYYY-MM-DD'))
const endDate = ref(dayjs().format('YYYY-MM-DD'))
const productionLinesInput = ref([])
const unconfirmSelectedProductionLines = computed(() => productionLinesInput.value.filter((value) => value != null))
const selectedProductionLines = ref([])
const selectedProductionLineId = ref(null)

const machinesData = ref([])
const partsData = ref(null)
const shiftsData = ref(null)
const totalProduced = ref(null)
const totalRejected = ref(null)
const selectedPartIds = ref([])
const selectedShiftIds = ref([])

const filteredMachinesData = ref([])
const selectedPart = ref([])
const selectedShift = ref([])

const page = ref(1)
const limit = ref(3)
const totalPages = computed(() => Math.ceil(machinesData.value.length / limit.value));

// Watch for changes in machinesData and apply filter
watch(machinesData, (newValue) => {
    filteredMachinesData.value = applyFilterToMachines(newValue);
})

const filteredParts = computed(() => {
    if (partsData.value && selectedPart.value.length) {
        return partsData.value.filter(part => selectedPart.value.includes(part.part_id));
    } else {
        return [];
    }
})

const filteredShifts = computed(() => {
    if (shiftsData.value && selectedShift.value.length) {
        return shiftsData.value.filter(shift => selectedShift.value.includes(shift.shift_id));
    } else {
        return [];
    }
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
                await getEffectivenessChart()
                storeFilterDateIntoCookies()
            }
        }
    })

    await getProductionLineAccessData()

    await applyFilter()
    
})

async function loadFilterFromCookies() {
    // Date filter
    const savedDateFilter = cookie.get(ConstantConfig.appCookie.oee.effectivenessDateFilter)
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

    if (cookie.get(ConstantConfig.appCookie.oee.effectivenessProductionLineFilter) != undefined) {
        const lineFromCookies = cookie.get(ConstantConfig.appCookie.oee.effectivenessProductionLineFilter)
        selectedProductionLineId.value = lineFromCookies[0]
    }
}

function storeFilterDateIntoCookies() {
    cookie.set(ConstantConfig.appCookie.oee.effectivenessDateFilter, dateFilter.value)
}

async function showFactoryModal() {
    const myModalEl = document.getElementById('factoryModal')
    const modal = new bootstrap.Modal(myModalEl, {
        keyboard: false
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
    selectedProductionLines.value = [selectedProductionLineId.value];

    //reset checkbox selection
    selectedPartIds.value = []
    selectedShiftIds.value = []

    // Show production line name on badge
    const line = productionLineNameList.value.find(item => item.id === selectedProductionLineId.value);
    selectedProductionLineNameList.value = line ? [line.name] : [];

    await getEffectivenessChart();

    // Store filter in cookies
    if (selectedProductionLineId.value != null) {
        cookie.set(ConstantConfig.appCookie.oee.effectivenessProductionLineFilter, [selectedProductionLineId.value]);
    }
}

async function applyProductShiftFilter() {
    // Store selected parts and shifts
    const selectedParts = selectedPartIds.value.filter(value => value !== null);
    const selectedShifts = selectedShiftIds.value.filter(value => value !== null);

    // Apply filter
    selectedPart.value = selectedParts;
    selectedShift.value = selectedShifts;
    
    filteredMachinesData.value = applyFilterToMachines(machinesData.value);
    await getEffectivenessChart();
}

async function getEffectivenessChart() {
    await window.axios.get(apiRoute({ 
        name: 'api_oee:default_dashboard.effectiveness_chart', 
        query: { 
            production_line: selectedProductionLineId.value,
            start_date: startDate.value,
            end_date: endDate.value,
            product: selectedPart.value.join(','),
            shift: selectedShift.value.join(','),
            page: page.value,
            limit: limit.value
        } }))
    .then(function(response) {
        effectivenessData.value = response.data.data
        machinesData.value = response.data.data.machines
        partsData.value = response.data.data.parts
        shiftsData.value = response.data.data.shifts
        totalProduced.value = response.data.data.total_unit_produced
        totalRejected.value = response.data.data.total_unit_rejected

        // Filter unique part_id
        const uniqueParts = {};
        partsData.value.forEach(part => {
            uniqueParts[part.part_id] = part;
        });
        partsData.value = Object.values(uniqueParts);

        // Filter unique shift_id
        const uniqueShifts = {};
        shiftsData.value.forEach(shift => {
            uniqueShifts[shift.shift_id] = shift;
        });
        shiftsData.value = Object.values(uniqueShifts);

    })
    .catch(function (error) {
        snackbar('Error on retrieving data!')
    })
}

function applyFilterToMachines(data) {
    // Filter machines data based on selected production lines
    return data.filter(machine => selectedProductionLines.value.includes(machine.production_line_id));
}

const paginatedMachinesData = computed(() => {
    const startIndex = (page.value - 1) * limit.value;
    return machinesData.value.slice(startIndex, startIndex + limit.value);
});

function nextPage() {
    page.value++;
}

function previousPage() {
    if (page.value > 1) {
        page.value--;
    }
}

// Method to navigate to a specific page
const goToPage = (pageNumber) => {
    page.value = pageNumber;
}
</script>

<style lang="css" scoped>
.scroll {
    height: 350px;
    overflow: auto;
    float: left;
}

.scroll4::-webkit-scrollbar {
    width: 10px;
}

.scroll4::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 20px;
}

.scroll4::-webkit-scrollbar-track {
    background: #ddd;
    border-radius: 20px;
}

.offcanvas-footer{
    padding: 1rem 1rem;
    border-top: 1px solid #dee2e6;
}
</style>