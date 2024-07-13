<template>
    <div>
        <DashboardNameHeader :dashboard="currentDashboard" />
        <div class="row g-3">
            <div :class="[convertWidgetWidthToBootstrapColumn(userWidget.widget_width)]" :key="userWidget.id"
                v-for="(userWidget, index) in userWidgets" v-if="userWidgets.length > 0">
                <div class="card h-100">
                    <WidgetTitleCardHeader
                        :title="userWidget.widget_name"
                        :widget-id="userWidget.id"
                        :is-first="userWidget.order <= 1"
                        :is-last="userWidget.order >= userWidgets.length"
                        @reorder-widget="changeOrder($event, index, userWidget.order)"
                    />
                    <PlanProductionTimeWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.planProductionTime" />
                    <RunTimeWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.runTime" />
                    <NetRunTimeWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.netRunTime" />
                    <PerformanceLossGaugeWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.performanceLoss" />
                    <AvailabilityLossGaugeWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.availabilityLoss" />
                    <QualityLossGaugeWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.qualityLoss"/>
                    <TEEPScoresWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.teepScore" />
                    <ListofShiftWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.shiftHours"/>
                    <HoursOperatedWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.hoursOperated"/>
                    <DowntimeByCauseWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.downtimeCause"/>
                    <DowntimeByDepartmentWidget :parent-props="userWidget" v-if="userWidget.widget_type.code == ConstantConfig.widgetCode.downtimeDepartment" />                    
                    <!-- Next widget add here -->
                    <WidgetCardFooter :parent-props="userWidget">
                        <a class="dropdown-item" href="javascript:;" @click="showWidgetFormModal('edit', userWidget)">Edit</a>
                        <a class="dropdown-item" href="javascript:;" @click="showDateModal(userWidget)">Date</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item text-danger" href="javascript:;" @click="deleteWidget(index, userWidget.id, userWidget.widget_name)">Delete</a>
                    </WidgetCardFooter>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-12 col-lg-12 mb-4">              
                <div class="card border border-light" @click="showWidgetFormModal('add')">
                    <div class="card-body">
                        <div class="d-flex justify-content-center">
                            <i class="bi bi-plus-square"></i>
                        </div>
                        <p class="card-text text-center">Add Widget</p>
                    </div>
                </div>
            </div>
        </div>
        <ChangeWidgetDateModal :parent-props="dateModalProp" :date-modal-instance="dateModalInstance" @updated-widget-data="updateSpecificWidgetObject" />
        <WidgetFormModal 
            :widget-modal-action="widgetModalAction" 
            :existing-widget-data="wantToUpdateWidgetData" 
            @updated-widget-data="(widgetData, action) => userWidgetObjectFromModal(widgetData, action)"
        />
    </div>
</template>

<script setup>
import { confirmDialog } from '@/components/SweetAlert'
import { ref, onMounted, onUpdated, defineAsyncComponent, provide } from 'vue'
import { useRoute } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import { loadingOverlay } from '@/components/LoadingOverlay'
import apiRoute from '@/helpers/ApiHelper'
import ConstantConfig from '@/config/ConstantConfig'
import WidgetTitleCardHeader from '@/views/oee/dynamic-dashboard/WidgetTitleCardHeader.vue'
import WidgetCardFooter from '@/views/oee/dynamic-dashboard/WidgetCardFooter.vue'
import ChangeWidgetDateModal from '@/views/oee/dynamic-dashboard/ChangeWidgetDateModal.vue'
import WidgetFormModal from '@/views/oee/dynamic-dashboard/WidgetFormModal.vue'
import DashboardNameHeader from '@/views/oee/dynamic-dashboard/DashboardNameHeader.vue'

const PlanProductionTimeWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/PlanProductionTimeWidget.vue'))
const RunTimeWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/RunTimeWidget.vue'))
const NetRunTimeWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/NetRunTimeWidget.vue'))
const PerformanceLossGaugeWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/PerformanceLossGaugeWidget.vue'))
const AvailabilityLossGaugeWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/AvailabilityLossGaugeWidget.vue'))
const QualityLossGaugeWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/QualityLossGaugeWidget.vue'))
const TEEPScoresWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/TEEPScoresWidget.vue'))
const ListofShiftWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/ListofShiftWidget.vue'))
const HoursOperatedWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/HoursOperatedWidget.vue'))
const DowntimeByCauseWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/DowntimeByCauseWidget.vue'))
const DowntimeByDepartmentWidget = defineAsyncComponent(() => import('@/views/oee/dynamic-dashboard/DowntimeByDepartmentWidget.vue'))

const emit = defineEmits(['reorderWidget'])
const currentRoute = useRoute()

let dateModalInstance
let widgetFormModalInstance

const userWidgets = ref([]) // List widget created for this dashboard
const dashboardId = ref() // Reactive dashboard ID
const dateModalProp = ref(null) // Change date modal prop
const widgetModalAction = ref(null)
const currentDashboard = ref({}) // Dashboard data
const wantToUpdateWidgetData = ref({}) // Widget want to update using form modal
const formModalOpen = ref(null) // Modal action. Example: 'add' or 'edit'

provide('dynamicWidgetFormModal', formModalOpen)

onMounted(async () => {
    loadingOverlay('show')

    if (! widgetFormModalInstance) {
        widgetFormModalInstance = new bootstrap.Modal('#widget-form-modal') // Initialize widget modal   
    }

    dashboardId.value = currentRoute.params.dashboardUuid
    await getDashboardDetail()
    await getDashboardWidgets()

    loadingOverlay('hide')
})

onUpdated(async () => {
    if (dashboardId.value != currentRoute.params.dashboardUuid) {
        loadingOverlay('show')

        dashboardId.value = currentRoute.params.dashboardUuid
        await getDashboardDetail()
        await getDashboardWidgets()

        loadingOverlay('hide')
    }
})

function showWidgetFormModal(action, existingUserWidget = null) {
    widgetModalAction.value = action
    wantToUpdateWidgetData.value = existingUserWidget
    formModalOpen.value = action
    widgetFormModalInstance.show()
}

function userWidgetObjectFromModal(widgetData, action) {
    widgetFormModalInstance.hide()

    if (action == 'add') {
        userWidgets.value.push(widgetData)         
    } else {
        updateSpecificWidgetObject(widgetData) 
    }
}

function updateSpecificWidgetObject(widgetObject) {
    var index = userWidgets.value.findIndex((obj => obj.id == widgetObject.id))
    userWidgets.value[index] = widgetObject
}

function showDateModal(widgetProp) {
    if (! dateModalInstance) {
        dateModalInstance = new bootstrap.Modal(document.getElementById('date-modal'))
    }

    dateModalInstance.show()
    dateModalProp.value = widgetProp
}

function deleteWidget(widgetIndex, widgetId, widgetName) {
    confirmDialog(`Delete ${widgetName} widget`, async () => {
        await window.axios.delete(apiRoute({ name: 'api_oee:user_dashboard.delete_dashboard_widget', params: { dashboardWidget: widgetId } }))
            .then((response) => {
                if (response.data.status == true) {
                    var widgetToDelete = userWidgets.value.filter((value) => value.id == widgetId)[0]

                    // Delete widget
                    userWidgets.value.splice(widgetIndex, 1)

                    // Rearrange order number
                    userWidgets.value.map((value) => {
                        if (value.order > widgetToDelete.order) {
                            value['order'] = parseInt(value.order) - 1
                        }
                    })

                    snackbar(response.data.message)
                }
            })
            .catch((error) => {
                snackbar('Unexpected Error: Unable to delete widget.')
            })
    })
}

function changeOrder(position, widgetIndex, changeTo) {
    if (position == 'up') {
        var currentIndex = widgetIndex
        var currentOrderChangeTo = parseInt(changeTo) - parseInt(1)

        var anotherIndex = parseInt(widgetIndex) - parseInt(1)
        var anotherOrderChangeTo = parseInt(changeTo)
    } else {
        var currentIndex = widgetIndex
        var currentOrderChangeTo = parseInt(changeTo) + parseInt(1)

        var anotherIndex = parseInt(widgetIndex) + parseInt(1)
        var anotherOrderChangeTo = parseInt(changeTo)
    }

    userWidgets.value[currentIndex].order = currentOrderChangeTo
    userWidgets.value[anotherIndex].order = anotherOrderChangeTo

    userWidgets.value.sort((a, b) => parseInt(a.order) - parseInt(b.order))
}

function convertWidgetWidthToBootstrapColumn(width) {
    let column

    if (width == 25) {
        column = 'col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12'
    } else if (width == 33) {
        column = 'col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12'
    } else if (width == 50) {
        column = 'col-xxl-6 col-lx-6 col-lg-6 col-md-6 col-sm-6 col-12'
    } else if (width == 75) {
        column = 'col-xxl-9 col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12'
    } else {
        column = 'col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'
    }

    return column
}

async function getDashboardWidgets() {
    await window.axios.get(apiRoute({ name: 'api_oee:user_dashboard.get_dashboard_widgets', params: { dashboardUuid: currentRoute.params.dashboardUuid } }))
        .then(function (response) {
            userWidgets.value = response.data.data
        })
}

async function getDashboardDetail() {
    await window.axios.get(apiRoute({ name: 'api_oee:user_dashboard.dashboard_details', params: { dashboardUuid: currentRoute.params.dashboardUuid } }))
        .then(response => {
            const responseData = response.data.data

            if (responseData && responseData.dashboard_name) {
                currentDashboard.value = response.data.data
            }
        })
}
</script>

<style lang="css" scoped>
.card.border {
    box-shadow: none;
    cursor: pointer;
}

.card-stretch {
    border: none;
    box-shadow: none;
}
</style>
