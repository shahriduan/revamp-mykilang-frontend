<template>
    <PageHeaderTitle>
        <h5>Production</h5>
    </PageHeaderTitle>

    <div class="row mt-1 mb-1 gy-2 gy-sm-0">
        <div class="col-md-3 col-lg-4 col-xxl-6"></div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xxl-3 ps-sm-2">
            <input class="form-control" type="text" :value="formattedMonthYear" readonly style="cursor: pointer" @click="showMonthYearModal()" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xxl-3 ps-sm-2">
            <input class="form-control" type="text" placeholder="Factories" readonly style="cursor: pointer" @click="showFactoryModal()" />
        </div>
    </div>

    <div class="mb-1 d-flex align-items-center">
        <span class="h5 me-2">Filters by: </span>
        <span class="badge rounded-pill bg-primary" v-if="selectedFactories.length == 0">No Factory selected</span>
        <span v-else>
            <h4><span class="badge rounded-pill bg-dark me-1" v-for="factoryName in selectedFactoryNameList">{{ factoryName }}</span></h4>
        </span>
        <span v-if="loadingFilter" class="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
                        <h4 class="mb-1">Factories</h4>
                    </div>
                    <div class="p-4">
                        <div v-if="loading" class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <div v-else v-for="factory in listFactories">
                            <div class="form-check mb-0" style="margin-left: 15px">
                                <input class="form-check-input" :id="'factory' + factory.id" type="radio" :value="factory.id" v-model="selectedFactoryId" />
                                <label class="form-check-label" :for="'factory' + factory.id">{{ factory.name }}</label>
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

    <div class="modal fade" id="monthYearModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Select Month and Year</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            <select class="form-select" v-model="selectedMonth">
                                <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
                            </select>
                        </div>
                        <div class="col">
                            <input type="number" class="form-control" v-model="selectedYear" min="1970" max="2100" step="1">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="selectMonthYear">Select</button>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-4 mb-1">
            <div class="card-body text-center">
                <div class="card bg-success py-2">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="completedRef">0</span>
                    <h4 class="text-white">Completed</h4>
                </div>
            </div>
        </div>
        <div class="col-lg-4 mb-1">
            <div class="card-body text-center">
                <div class="card bg-primary py-2">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="inProgressRef">0</span>
                    <h4 class="text-white">In Progress</h4>
                </div>
            </div>
        </div>
        <div class="col-lg-4 mb-1">
            <div class="card-body text-center">
                <div class="card bg-warning py-2">
                    <span class="fw-medium h3 text-white" data-echart-responsive="true" ref="totalProductionRef">0</span>
                    <h4 class="text-white">Planned</h4>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-1">
        <!-- left side -->
        <div class="col-lg-8">
            <div class="card-header d-flex align-items-center bg-body-tertiary py-1 mb-1 rounded">
                <h6 class="mb-0 flex-1 text-center">Production Schedule Calendar</h6>
            </div>
            <div class="card overflow-hidden p-3">
                <div class="card-body p-0 scrollbar">
                    <FullCalendar :options="calendarOptions" class="custom-calendar" />
                </div>
            </div>
        </div>

        <!-- right side -->
        <div class="col-lg-4 scroll scroll4">
            <ProductionWidget :parent-props="productionData" />
        </div>
    </div>
    
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { CountUp } from 'countup.js'
import { snackbar } from '@/components/Snackbar'
import interactionPlugin from '@fullcalendar/interaction'
import apiRoute from '@/helpers/ApiHelper'
import PageHeaderTitle from '@/views/supply-chain/_shared/PageHeaderTitle.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import ProductionWidget from '@/views/supply-chain/production/ProductionWidget.vue'

const listFactories = ref()
const selectedFactoryId = ref(null)
const selectedFactories = ref([])
const productionData = ref([])
const selectedFactoryNameList = ref([])
const loading = ref(true)
const loadingFilter = ref(false)

const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())
const selectedDate = ref(null)
const monthYear = ref(`${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}`)
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const completedRef = ref(null)
const inProgressRef = ref(null)
const totalProductionRef = ref(null)
let completedCountUp
let inProgressCountUp
let totalProductionCountUp

const formattedMonthYear = computed(() => {
    const [year, month] = monthYear.value.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
})

onMounted(async () => {    
    setTimeout(async () => {
        await getFactories();
        loading.value = false; // Set loading to false after data is loaded
    }, 3000);

    initializeCountUp()

})

function showMonthYearModal() {
    selectedMonth.value = parseInt(monthYear.value.split('-')[1]);
    selectedYear.value = parseInt(monthYear.value.split('-')[0]);

    const monthYearModal = new bootstrap.Modal(document.getElementById('monthYearModal'));
    monthYearModal.show();
}

async function selectMonthYear() {
    const monthYearModal = bootstrap.Modal.getInstance(document.getElementById('monthYearModal'));
    monthYearModal.hide();

    monthYear.value = `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}`;

    await getProductions()
}

async function showFactoryModal() {
    const myModalEl = document.getElementById("factoryModal");
    const modal = new bootstrap.Modal(myModalEl, {
        keyboard: false,
    });
    modal.show();

    // loading.value = true; // Set loading to true before fetching factories
    // await getFactories()
    // loading.value = false;

    if (listFactories.value > 0) {
        selectedFactoryId.value = listFactories.value[0].id;
    }
}

async function getFactories() {
    await window.axios.get(apiRoute({ name: 'api_base:factory.list' }))
        .then(function(response) {
            listFactories.value = response.data.data

        if (listFactories.value.length > 0) {
            selectedFactoryId.value = listFactories.value[0].id;
            applyFilter()
        }
            
        })
}

async function applyFilter() {
    loadingFilter.value = true

    selectedFactories.value = [selectedFactoryId.value];

    // Show production line name on badge
    const factory = listFactories.value.find(item => item.id === selectedFactoryId.value);
    selectedFactoryNameList.value = factory ? [factory.name] : [];

    loading.value = true;
    await getProductions()
    loading.value = false;

    loadingFilter.value = false;
}

async function getProductions() {
    await window.axios.get(apiRoute({ 
        name: 'api:basic_module.get_productions', 
        query: { 
            factory: selectedFactories.value.toString(),
            month: monthYear.value,
            date: selectedDate.value
        } }))
    .then(function (response) {
        productionData.value = response.data.data

        updateCalendarEvents(response.data.data.date)
        initializeCountUp()
    })
}

const calendarOptions = ref({
    plugins: [ dayGridPlugin, interactionPlugin ],
    initialView: 'dayGridMonth',
    events: [],
    dateClick: function(arg) {
        selectedDate.value = arg.dateStr
        getProductions()
    },
    aspectRatio: 1.6, // Make day grid taller
    dayCellContent: function(arg) {
        const cellHtml = `
            <span class="fc-daygrid-day-number" style="font-size: 10px;">
                ${arg.dayNumberText}
            </span>
        `;
        return { html: cellHtml };
    }
})

function updateCalendarEvents(dates) {
    const events = dates.map(dateObj => {
        const [date, data] = Object.entries(dateObj)[0];
        return {
            title: `${data.productions_count}`,
            start: date,
            allDay: true
        }
    });
    calendarOptions.value.events = events
}

watch(() => productionData.value, (newValue, oldValue) => {
    initializeCountUp()
})

function initializeCountUp() {
    if (completedCountUp) completedCountUp.update(productionData.value.completed_productions_count)
    else completedCountUp = new CountUp(completedRef.value, productionData.value.completed_productions_count)

    if (inProgressCountUp) inProgressCountUp.update(productionData.value.in_progress_productions_count)
    else inProgressCountUp = new CountUp(inProgressRef.value, productionData.value.in_progress_productions_count)

    if (totalProductionCountUp) totalProductionCountUp.update(productionData.value.total_productions_count)
    else totalProductionCountUp = new CountUp(totalProductionRef.value, productionData.value.total_productions_count)

    // Start count-up animation
    completedCountUp.start()
    inProgressCountUp.start()
    totalProductionCountUp.start()
}

</script>

<style scoped>
.custom-calendar {
  width: 100%;
}

.scroll {
    height: 600px;
    overflow: auto;
    float: left;
}
</style>
