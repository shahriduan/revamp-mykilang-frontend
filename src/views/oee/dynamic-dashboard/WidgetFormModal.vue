<template>
    <div class="modal fade" id="widget-form-modal" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1">
        <div class="modal-dialog modal-xl mt-6" role="document">
            <div class="modal-content border-0">
                <div class="position-absolute top-0 end-0 mt-3 me-3 z-1">
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close" @click="onCloseModal">
                    </button>
                </div>
                <div class="modal-body p-0">
                    <div class="rounded-top-3 bg-body-tertiary py-3 ps-4 pe-6">
                        <h4 class="mb-1">{{ modalTitle }}</h4>
                    </div>
                    <div class="row m-3">
                        <div class="col-lg-4 mb-3 border-end">
                            <div v-for="widgetCategory in widgetTypes" v-if="widgetTypes.length > 0">
                                <label class="fw-bold">{{ widgetCategory.widget_category }}</label>
                                <div class="form-check" v-for="widgetType in widgetCategory.list_widget">
                                    <input 
                                        class="form-check-input" 
                                        type="radio" 
                                        :id="'radio-widget-type-' + widgetType.id"
                                        name="radio-widget"
                                        :checked="selectedWidget && selectedWidget.code == widgetType.code"
                                        @click="changeWidget(widgetType)"
                                    />
                                    <label class="form-check-label" :for="'radio-widget-type-' + widgetType.id">
                                        {{ widgetType.name }}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8 mt-3 mb-3 ms ps-4 vl">
                            <h4>{{ selectedWidgetTitle }}</h4>
                            <img :src="selectedWidgetImage" :alt="selectedWidget.name" class="img-fluid rounded-2 border border-2 border-dark" v-if="selectedWidget" />
                            <div class="mt-1">
                                <b>Description: </b>
                                {{ selectedWidgetDescription }}
                            </div>
                            <div class="mt-2" v-if="selectedWidget">
                                <label class="form-label" for="widget-name">Widget Name</label>
                                <input class="form-control" :class="{ 'is-invalid': form.widgetName.error != '' }" id="widget-name" v-model="form.widgetName.model" type="text" />
                                <div class="invalid-feedback">{{ form.widgetName.error }}</div>
                            </div>
                            <ul class="nav nav-tabs mt-3" id="myTab" role="tablist">
                                <li class="nav-item" v-for="(datatype, index) in selectedWidget.datatypes" v-if="selectedWidget">
                                    <a 
                                        class="nav-link" 
                                        :class="{ active: currentTab == datatype.datatype }" 
                                        :id="datatype.name + '-tab'" 
                                        data-bs-toggle="tab" 
                                        :href="'#tab-' + datatype.name" 
                                        role="tab" 
                                        :aria-controls="'tab-' + datatype.name" 
                                        aria-selected="true"
                                        @click="setActiveTab(datatype.datatype)">
                                        {{ datatype.name }}
                                    </a>
                                </li>
                            </ul>
                            <div class="tab-content p-3">
                                <div 
                                    class="tab-pane fade"
                                    :class="{ 'show active': currentTab == datatype.datatype }" 
                                    :id="datatype.datatype + '-home'" 
                                    role="tabpanel" 
                                    :aria-labelledby="datatype.datatype + '-tab'" 
                                    v-for="(datatype, index) in selectedWidget.datatypes" 
                                    v-if="selectedWidget">
                                    <div class="form-check mb-0">
                                        <input class="form-check-input" id="all-data" type="checkbox" v-model="selectAllData" @change="markEverything" />
                                        <label class="form-check-label" for="all-data">All {{ datatype.name }}</label>
                                    </div>
                                    <div v-for="parentData in globalLoopData">
                                        <div class="form-check mb-0" style="margin-left: 23px">
                                            <input 
                                                class="form-check-input" 
                                                :id="'parent-data-' + parentData.id" 
                                                type="checkbox" 
                                                :true-value="parentData.id" 
                                                :false-value="null" 
                                                v-model="selectedParentData[parentData.id]" 
                                                @change="markChildDataBasedOnParent(parentData.id)" 
                                            />
                                            <label class="form-check-label" :for="'parent-data-' + parentData.id">{{ parentData.name }}</label>
                                        </div>
                                        <div class="form-check mb-0" style="margin-left: 46px" v-for="childData in childLoop(parentData)">
                                            <input 
                                                class="form-check-input" 
                                                :id="'child-data-' + childData.id" 
                                                type="checkbox" 
                                                :true-value="childData.id" 
                                                :false-value="null" 
                                                v-model="selectedChildData[childData.id]"
                                                @change="watchChildCheckBox()"
                                            />
                                            <label class="form-check-label" :for="'child-data-' + childData.id">{{ childData.name }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-danger fs--1" v-if="form.selectedData.error">
                                <i class="fas fa-exclamation-triangle"></i> {{ form.selectedData.error }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal" @click="onCloseModal">Cancel</button>
                    <button class="btn btn-primary" type="button" @click="submitWidget" :disabled="submitLoader == true">{{ saveButtonTitle }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onUpdated, reactive, ref, watch, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { widgetOverviewImage } from '@/config/OEEConfig'
import apiRoute from '@/helpers/ApiHelper'

const props = defineProps({
    widgetModalAction: {
        required: true
    },
    // For update purpose
    existingWidgetData: {
        type: Object
    }
})

const emit = defineEmits(['updatedWidgetData'])

const currentRoute = useRoute()

/* Chain code: Add new data category */
const dataable = {
    productionLine: 'ProductionLine',
    product: 'ConfigPart',
    shift: 'ConfigShift',
    machine: 'Machine'
}

const widgetTypes = ref([])
const widgetTypeWithoutGroup = computed(() => {
    var listWidget = []

    if (widgetTypes.value.length > 0) {
        widgetTypes.value.forEach((itemGroup) => {
            itemGroup.list_widget.forEach((itemSub) => {
                listWidget.push(itemSub)
            })
        })
    }

    return listWidget
})

/* Chain code: Add new data category */
const productionLines = ref([]) // List production line
const products = ref([]) // List product
const shifts = ref([]) // List shift
const machines = ref([]) // List machines

const globalLoopData = ref([])
const globalDataWithoutGroup = computed(() => {
    var listData = []

    if (globalLoopData.value.length > 0) {
        globalLoopData.value.forEach((itemGroup) => {
            var child = childLoop(itemGroup)

            child.forEach((itemSub) => {
                itemSub['factory_id'] = itemGroup.id
                listData.push(JSON.parse(JSON.stringify(itemSub)))
            })
        })
    }

    return listData.sort((a, b) => a.id - b.id)
})
const currentUserWidget = computed(() => props.existingWidgetData) // Current widget data for edit purpose
const previousUserWidget = ref({}) // Previous edit widget data

const widgetModalAction = computed(() => props.widgetModalAction) // Modal action. Example: 'add' or 'edit'
const modalTitle = computed(() => widgetModalAction.value == 'add' ? 'New Widget' : 'Edit Widget')
const saveButtonTitle = computed(() => widgetModalAction.value == 'add' ? 'Add Widget' : 'Update Widget')
const selectedWidget = ref(null)
const selectedWidgetTitle = computed(() => selectedWidget.value?.name)
const selectedWidgetDescription = computed(() => selectedWidget.value?.description)
const selectedWidgetImage = computed(() => widgetOverviewImage[selectedWidget.value?.code] ?? null)
const currentTab = ref(null) // Example: ConfigPart
const selectAllData = ref(false) // Checkbox all
const selectedParentData = ref([])
const selectedChildData = ref([])
const dynamicWidgetFormModal = inject('dynamicWidgetFormModal')
const modalIsOpen = ref(dynamicWidgetFormModal)
const submitLoader = ref(false)

const form = reactive({
    widgetName: { model: '', error: '' },
    selectedData: { model: [], error: '' }
})

onMounted(() => {
    getWidgetTypes()
})

onUpdated(async () => {
    // Call widget type API once
    if (widgetModalAction.value != null && widgetTypes.value.length == 0) {
        await getWidgetTypes()
    }
})

watch(modalIsOpen, (newModalIsOpen) => {
    if (modalIsOpen.value == 'edit') {
        setTimeout(() => { 
            setDefaultWidgetWhenEdit()
        }, 250)
    } else {
        setTimeout(() => { 
            setDefaultWidgetWhenAdd()
        }, 250)
    }
})

const onCloseModal = () => {
    modalIsOpen.value = null
}

function watchChildCheckBox() {
    watchAllCheckbox()
    watchParentCheckbox()
}

function watchAllCheckbox() {
    let checkStatus = true

    globalDataWithoutGroup.value.forEach(item => {
        if (selectedChildData.value[item.id] === undefined || selectedChildData.value[item.id] === null) {
            checkStatus = false
        }
    })

    selectAllData.value = checkStatus
}

function watchParentCheckbox() {
    globalLoopData.value.forEach((item) => {
        var checkStatus = true

        var child = childLoop(item)

        child.forEach(childItem => {
            if (selectedChildData.value[childItem.id] === undefined || selectedChildData.value[childItem.id] === null) {
                checkStatus = false
            }
        })

        selectedParentData.value[item.id] = checkStatus == true ? item.id : null
    })
}

function childLoop(parentData) {
    /* Chain code: Add new data category */
    if (currentTab.value == dataable.productionLine) {
        var loop = parentData.production_line
    } else if (currentTab.value == dataable.product) {
        var loop = parentData.part
    } else if (currentTab.value == dataable.shift) {
        var loop = parentData.shift
    } else {
        var loop = parentData.machine
    }

    return loop
}

function markEverything() {
    globalLoopData.value.forEach(item => {
        selectedParentData.value[item.id] = selectAllData.value == true ? item.id : null
        markChildDataBasedOnParent(item.id)
    })
}

/**
 * @param {integer} parentId    Parent ID = Factory ID
 */
function markChildDataBasedOnParent(parentId) {
    globalDataWithoutGroup.value.forEach((item) => {
        if (item.factory_id == parentId) {
            selectedChildData.value[item.id] = selectedParentData.value[parentId] !== null ? item.id : null
        }
    })
}

async function setActiveTab(datatype) {
    clearSelectedData()

    currentTab.value = datatype

    /* Chain code: Add new data category */
    if (currentTab.value == dataable.productionLine) {
        if (productionLines.value.length == 0) {
            await getProductionLines()            
        }

        globalLoopData.value = productionLines.value

    } else if (currentTab.value == dataable.product) {
        if (products.value.length == 0) {
            await getProducts()            
        }

        globalLoopData.value = products.value

    } else if (currentTab.value == dataable.shift) {
        // Shift
        if (shifts.value.length == 0) {
            await getShifts()            
        }

        globalLoopData.value = shifts.value
    } else {
        // Machine
        if (machines.value.length == 0) {
            await getMachines()            
        }

        globalLoopData.value = machines.value
    }
}

async function changeWidget(widget, widgetTab = null) {
    selectedWidget.value = widget
    await setActiveTab(widgetTab == null ? selectedWidget.value.datatypes[0].datatype : widgetTab)
    setWidgetName()
}

function setWidgetName() {
    // If add action, update widget name to selected widget
    if (widgetModalAction.value == 'add') {
        form.widgetName.model = selectedWidgetTitle.value
    } 
}

async function setDefaultWidgetWhenEdit() {
    var defaultEditDataWidget = widgetTypeWithoutGroup.value.filter((item) => item.id == currentUserWidget.value.widget_type.id)[0]
    await changeWidget(defaultEditDataWidget, currentUserWidget.value.data_type)
    form.widgetName.model = currentUserWidget.value.widget_name

    selectedChildData.value = [null]

    // Mark checkbox by database data
    globalDataWithoutGroup.value.forEach((item, index) => {
        var newValue = currentUserWidget.value.data_id.includes(item.id) == true ? item.id : null

        if (newValue != null) {
            selectedChildData.value[newValue] = newValue
        }
    })

    watchChildCheckBox()
}

function setDefaultWidgetWhenAdd() {
    selectedWidget.value = widgetTypes.value[0].list_widget[0] // Set 1st widget in the list as selected widget
    form.widgetName.model = selectedWidgetTitle.value // Set widget name based on selected widget
    setActiveTab(selectedWidget.value.datatypes[0].datatype) // Set 1st tab in list as selected tab
    previousUserWidget.value = {}
}

function clearSelectedData() {
    selectedChildData.value = []
    selectedParentData.value = []
    selectAllData.value = false
}

async function getProductionLines() {
    await window.axios.get(apiRoute({ name: 'api:user_access.production_line_list' }))
        .then(response => productionLines.value = response.data.data)
}

async function getProducts() {
    await window.axios.get(apiRoute({ name: 'api:user_access.part_list' }))
        .then(response => products.value = response.data.data)
}

async function getShifts() {
    await window.axios.get(apiRoute({ name: 'api:user_access.shift_list' }))
        .then(response => shifts.value = response.data.data)
}

async function getMachines() {
    await window.axios.get(apiRoute({ name: 'api:user_access.machine_list' }))
        .then(response => machines.value = response.data.data)
}

async function getWidgetTypes() {
    await window.axios.get(apiRoute({ name: 'api_oee:user_dashboard.widget_types' }))
        .then(response => {
            widgetTypes.value = response.data.data

            if (widgetModalAction.value == 'add') {
                setDefaultWidgetWhenAdd()
            }
        })
}

async function submitWidget() {
    submitLoader.value = true

    if (widgetModalAction.value == 'add') {
        var urlParam = { dashboardUuid: currentRoute.params.dashboardUuid }
    } else {
        var urlParam = { dashboardUuid: currentRoute.params.dashboardUuid, dashboardWidget: currentUserWidget.value.id }
    }

    var selectedId = selectedChildData.value.filter((value) => value != null)

    await window.axios.post(apiRoute({ name: 'api_oee:user_dashboard.submit_dashboard_widget', params: urlParam }), {
            widget_type: selectedWidget.value.id,
            widget_name: form.widgetName.model,
            widget_width: selectedWidget.value.default_width,
            data_type: currentTab.value,
            data_id: selectedId
        })
        .then(response => {
            if (response.data.status == true) {
                emit('updatedWidgetData', response.data.data, widgetModalAction.value)   
  
                // Clear input
                form.widgetName.error = form.selectedData.error = form.widgetName.model = ''
                form.selectedData.model = selectedParentData.value = selectedChildData.value = widgetTypes.value = []
                selectAllData.value = false

                onCloseModal()

            } else {
                form.widgetName.error = response.data.error.widget_name?.[0] ?? ''
                form.selectedData.error = response.data.error.data_id?.[0] ?? ''
            }
        })

    submitLoader.value = false
}
</script>