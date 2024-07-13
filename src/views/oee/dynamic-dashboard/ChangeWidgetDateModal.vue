<template>
    <div class="modal fade" id="date-modal" tabindex="-1" role="dialog" aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content position-relative">
                <div class="position-absolute top-0 end-0 mt-2 me-2 z-1">
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" @click="closeModal"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                        <h4 class="mb-0">{{ userWidget?.widget_name }} Widget</h4>
                    </div>
                    <div class="p-4">
                        <div class="row">
                            <div class="col-12 col-lg-4">
                                <div class="d-flex flex-column">
                                    <button 
                                        class="btn btn-outline-primary mb-2" 
                                        :class="{ active: selectedFilterType == availableFilterType.name }" 
                                        type="button"
                                        @click="changeFilterType(availableFilterType.name)"
                                        v-for="availableFilterType in userWidget.available_date_filter_type" 
                                        v-if="userWidget">
                                        {{ utilityHelper.ucwords(availableFilterType.name.replaceAll('_', ' ')) }}
                                    </button>
                                </div>
                            </div>
                            <div class="col-12 col-lg-8 border-start-lg ps-lg-4">
                                <div class="d-flex flex-column">
                                    <div id="inline-flatpickr"></div>
                                    <div class="mt-4 d-flex flex-column flex-sm-row">
                                        <span>
                                            Selected period 
                                        </span>
                                        <span>
                                            <i class="fa-regular fa-calendar mx-sm-2"></i>
                                            <span class="text-600">
                                                {{ showSelectedStartPeriod }} <i class="fas fa-arrow-right mx-1"></i> {{ showSelectedEndPeriod }}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div class="mt-2 text-danger" v-if="startDateError || endDateError">
                                    <div v-if="startDateError">
                                        <i class="fas fa-exclamation-triangle"></i> {{ startDateError }}
                                        <br>
                                    </div>
                                    <div v-if="endDateError">
                                        <i class="fas fa-exclamation-triangle"></i> {{ endDateError }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" @click="closeModal">Cancel</button>
                    <button class="btn btn-primary" type="button" :disabled="submitLoader" @click="submitChangeDate">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, computed, onMounted, onUpdated } from 'vue'
import { snackbar } from '@/components/Snackbar'
import dayjs from 'dayjs'
import apiRoute from '@/helpers/ApiHelper'
import flatpickr from 'flatpickr'
import UtilityHelper from '@/helpers/UtilityHelper'
import ConstantConfig from '@/config/ConstantConfig'

const props = defineProps(['parentProps', 'dateModalInstance'])
const emit = defineEmits(['updatedWidgetData'])

var utilityHelper = new UtilityHelper

const userWidget = computed(() => props.parentProps)
const selectedFilterType = ref(null) // Selected value on modal
const showSelectedStartPeriod = ref(null) // Display on modal
const showSelectedEndPeriod = ref(null) // Display on modal

const formFilterType = computed(() => {
    return userWidget.value && userWidget.value.available_date_filter_type.find(obj => obj.name == selectedFilterType.value).id
})
const formStartDate = computed(() => showSelectedStartPeriod.value ? dayjs(showSelectedStartPeriod.value, 'DD MMM YYYY').format('YYYY-MM-DD') : '')
const formEndDate = computed(() => showSelectedEndPeriod.value ? dayjs(showSelectedEndPeriod.value, 'DD MMM YYYY').format('YYYY-MM-DD') : '')
const startDateError = ref(null)
const endDateError = ref(null)

const submitLoader = ref(false)

const flatpickrOption = {
    dateFormat: 'd/m/Y',
    disableMobile: true,
    inline: true,
    mode: 'range',
    showMonths: 1,
    onChange: (selectedDates) => {
        selectedFilterType.value = ConstantConfig.getDateFilterType.customRange

        var selectStart = selectedDates[0]
        showSelectedStartPeriod.value = dayjs(selectStart).format('DD MMM YYYY')

        if (selectedDates[1]) {
            var selectEnd = selectedDates[1]
            showSelectedEndPeriod.value = dayjs(selectEnd).format('DD MMM YYYY')
        }
    }
}

onMounted(() => {
    flatpickr('#inline-flatpickr', {
        ...flatpickrOption
    })
})

onUpdated(() => {

})

watch(() => props.parentProps, () => {
    if (props.parentProps) {
        changeFilterType(props.parentProps?.date_filter_type?.name)        
    }
})

function closeModal() {
    startDateError.value = endDateError.value = null
    props.dateModalInstance.hide()
}

function changeFilterType(filterType) {
    selectedFilterType.value = filterType

    if (filterType == ConstantConfig.getDateFilterType.customRange || filterType == ConstantConfig.getDateFilterType.customDay) {
        if (props.parentProps.start_date_filter != null || props.parentProps.end_date_filter != null) {
            showSelectedStartPeriod.value = dayjs(props.parentProps.start_date_filter, 'YYYY-MM-DD').format('DD MMM YYYY')
            showSelectedEndPeriod.value = dayjs(props.parentProps.end_date_filter, 'YYYY-MM-DD').format('DD MMM YYYY')
        }
    } else {
        if (filterType == ConstantConfig.getDateFilterType.today) {
            showSelectedStartPeriod.value = dayjs().format('DD MMM YYYY')
        } else if (filterType == ConstantConfig.getDateFilterType.lastMonth) {
            showSelectedStartPeriod.value = dayjs().subtract(1, 'month').format('DD MMM YYYY')
        } else if (filterType == ConstantConfig.getDateFilterType.last3Month) {
            showSelectedStartPeriod.value = dayjs().subtract(3, 'month').format('DD MMM YYYY')
        } else if (filterType == ConstantConfig.getDateFilterType.last6Month) {
            showSelectedStartPeriod.value = dayjs().subtract(6, 'month').format('DD MMM YYYY')
        } else {
            showSelectedStartPeriod.value = dayjs().subtract(1, 'year').format('DD MMM YYYY') // Last year
        }

        showSelectedEndPeriod.value = dayjs().format('DD MMM YYYY')
    }

    flatpickr('#inline-flatpickr', {
        ...flatpickrOption,
        defaultDate: [
            dayjs(showSelectedStartPeriod.value, 'DD MMM YYYY').format('DD/MM/YYYY'),
            dayjs(showSelectedEndPeriod.value, 'DD MMM YYYY').format('DD/MM/YYYY')
        ]
    })
}

async function submitChangeDate() {
    submitLoader.value = true

    await window.axios.post(apiRoute({ name: 'api_oee:user_dashboard.change_widget_date', params: { dashboardWidget: userWidget.value.id }}), {
            date_filter_type: formFilterType.value,
            start_date:formStartDate.value,
            end_date: formEndDate.value
        })
        .then(response => {
            if (response.data.status == true) {
                emit('updatedWidgetData', response.data.data)
                closeModal()
            } else {
                startDateError.value = response.data.error.start_date[0] != undefined ? response.data.error.start_date[0] : null
                endDateError.value = response.data.error.end_date[0] != undefined ? response.data.error.end_date[0] : null
            }

            submitLoader.value = false
        })
        .catch(error => {
            snackbar('Unexpected Error: Unable to change date.')
        })
}
</script>