<template>
    <PageHeaderTitle>
        <h5>Warehouse</h5>
    </PageHeaderTitle>

    <div class="row mt-1 mb-1 gy-2 gy-sm-0">
        <div class="col-md-3 col-lg-4 col-xxl-6"></div>
        <div class="col-12 col-sm-6 col-md-5 col-lg-4 col-xxl-3"></div>
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
        <span v-if="loadingFilter" class="ms-2 spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></span>
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

    <div class="row">
        <!-- left side -->
        <div class="col-sm-12 col-md-7 col-lg-9 mb-0">
            <StockLocationWidget :parent-props="warehouseData" />
        </div>

        <!-- right side -->
        <div class="col-sm-12 col-md-5 col-lg-3">
            <div class="card px-4">
                <div class="row">
                    <div class="col-sm-6 col-md-4 mt-4">
                        <div class="card-img-center">
                            <img class="img-fluid smaller-image" src="/img/supply-chain/update.png"/>
                        </div>
                    </div>
                    <div class="col-sm-6 col-md-8 mb-0 g-0">
                        <div class="card-body">
                            <div class="chart-container text-center">
                                <span class="fw-medium h5" data-echart-responsive="true" ref="totalStockRef">0</span>
                                <h6>Total Stock</h6>
                                <h6>(Units)</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Stock Aging -->
    <div class="row mt-1 g-1">
        <div class="col-12">
            <StockAgingWidget :parent-props="warehouseData" />            
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { CountUp } from 'countup.js'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'
import PageHeaderTitle from '@/views/supply-chain/_shared/PageHeaderTitle.vue'
import StockLocationWidget from '@/views/supply-chain/warehouse/StockLocationWidget.vue'
import StockAgingWidget from '@/views/supply-chain/warehouse/StockAgingWidget.vue'

let isHorizontal = true
let chartInstance
const warehouseHeatMap = ref(null)

const totalStockRef = ref(null)
const dispatchStockRef = ref(null)
let totalStockCountUp
let dispatchStockCountUp

const warehouseData = ref([])
const selectedFactoryId = ref(null)
const selectedFactories = ref([])
const selectedFactoryNameList = ref([])
const listFactories = ref()
const loading = ref(true)
const loadingFilter = ref(false)

onMounted(async() => {
    setTimeout(async () => {
        await getFactories();
        loading.value = false; // Set loading to false after data is loaded
    }, 3000);

    initializeCountUp()

})

const toggleOrientation = () => {
    isHorizontal = !isHorizontal;
    updateChart();
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

async function applyFilter() {
    loadingFilter.value = true

    selectedFactories.value = [selectedFactoryId.value];

    // Show production line name on badge
    const factory = listFactories.value.find(item => item.id === selectedFactoryId.value);
    selectedFactoryNameList.value = factory ? [factory.name] : [];

    loading.value = true;
    await getWarehouses()
    loading.value = false;

    loadingFilter.value = false;
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

async function getWarehouses() {
    await window.axios.get(apiRoute({ name: 'api:basic_module.get_warehouse_stocks', query: { factory: selectedFactoryId.value } }))
    .then(function (response) {
        warehouseData.value = response.data.data
    })
    .catch(function (error) {
        snackbar('Error retrieving the data !')
    })
}

watch(() => warehouseData.value, (newValue, oldValue) => {
    initializeCountUp()
})

function initializeCountUp() {
    if (totalStockCountUp) totalStockCountUp.update(warehouseData.value.total_warehouse_stocks_sum)
    else totalStockCountUp = new CountUp(totalStockRef.value, warehouseData.value.total_warehouse_stocks_sum)

    // Start count-up animation
    totalStockCountUp.start()
}

</script>

<style lang="css" scoped>
.smaller-image {
    max-width: 80%;
    height: auto;
}
</style>
