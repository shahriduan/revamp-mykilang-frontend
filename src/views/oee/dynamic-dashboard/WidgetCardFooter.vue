<template>
    <div class="card-footer bg-body-tertiary py-2">
        <div class="d-flex justify-content-between">
            <div class="me-1 fs--1 align-self-center">
                {{ displayFilteredWidgetDate.start }} 
                <i class="fas fa-arrow-right mx-1" v-if="displayFilteredWidgetDate.end"></i> 
                {{ displayFilteredWidgetDate.end }}
            </div>
            <div class="dropdown font-sans-serif btn-reveal-trigger">
                <button 
                    class="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal" 
                    type="button" 
                    id="dropdown-top-products" 
                    data-bs-toggle="dropdown" 
                    data-boundary="viewport" 
                    aria-haspopup="true" 
                    aria-expanded="false">
                    <span class="fas fa-ellipsis-h fs--5"></span>
                </button>
                <div class="dropdown-menu dropdown-menu-end border py-2" aria-labelledby="dropdown-top-products">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import ConstantConfig from '@/config/ConstantConfig'
import UtilityHelper from '@/helpers/UtilityHelper'

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

const displayFilteredWidgetDate = computed(() => {
    var filterType = props.parentProps.date_filter_type.name
    
    if (filterType == ConstantConfig.getDateFilterType.customRange || filterType == ConstantConfig.getDateFilterType.customDay) {
        var startDate = dayjs(props.parentProps.start_date_filter, 'YYYY-MM-DD').format('DD MMM YYYY')
        var endDate = dayjs(props.parentProps.end_date_filter, 'YYYY-MM-DD').format('DD MMM YYYY')
    } else {
        var utilityHelper = new UtilityHelper
        var startDate = utilityHelper.ucwords(filterType.replaceAll('_', ' '))
        var endDate = null
    }

    return {
        start: startDate,
        end: endDate
    }
})
</script>