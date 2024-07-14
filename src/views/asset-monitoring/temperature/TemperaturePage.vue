<template>
    <MonitoringContentNavPills>
        <div class="row mt-2 gy-2 gy-sm-0">
            <div class="col-md-3 col-lg-4 col-xxl-6"></div>
            <div class="col-12 col-sm-6 col-md-5 col-lg-4 col-xxl-3 pe-sm-2"></div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xxl-3 ps-sm-2">
                <input class="form-control datetimepicker" id="datepicker" type="text" v-model="dateFilter"
                    placeholder="Date" />
            </div>
        </div>

        <div class="row mt-1 g-1">
            <div class="card-header py-2 text-end" style="background-color: #152b48;">
                <div class="col-auto align-self-center">
                    <h6 class="text-center text-white mb-0" style="font-size: 16.4px;">Heatmap</h6>
                </div>
            </div>
            <div class="card">
                <div class="card-body unit">
                    <div class="row g-3">
                        <div class="col-sm-12">
                            <div class="d-flex justify-content-center align-items-center noData">
                                No data for specific date picked
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-1 g-1">
            <div class="card-header py-2 text-end" style="background-color: #152b48;">
                <div class="col-auto align-self-center">
                    <h6 class="text-center text-white mb-0" style="font-size: 16.4px;">Trend Temperature</h6>
                </div>
            </div>
            <div class="card">
                <div class="card-body unit">
                    <div class="row g-3">
                        <div class="col-sm-12">
                            <div class="d-flex justify-content-center align-items-center noData">
                                No data for specific date picked
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-1 g-1">
            <div class="card-header py-2 text-end" style="background-color: #152b48;">
                <div class="col-auto align-self-center">
                    <h6 class="text-center text-white mb-0" style="font-size: 16.4px;">History Temperature</h6>
                </div>
            </div>
            <div class="card">
                <div class="card-body unit">
                    <div class="row g-3">
                        <div class="col-sm-12">
                            <div class="d-flex justify-content-center align-items-center noData">
                                No data for specific date picked
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MonitoringContentNavPills>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import MonitoringContentNavPills from '@/views/asset-monitoring/_shared/MonitoringContentNavPills.vue'
import flatpickr from 'flatpickr'
import dayjs from 'dayjs'

const dateFilter = ref(dayjs().format("DD/MM/YYYY"))
const startDate = ref(dayjs().format("YYYY-MM-DD"))
const endDate = ref(dayjs().format("YYYY-MM-DD"))

onMounted(() => {
    // await loadFilterFromCookies()

    flatpickr("#datepicker", {
        mode: "range",
        dateFormat: "d/m/Y",
        defaultDate: [dayjs(startDate.value).format('DD/MM/YYYY'), dayjs(endDate.value).format('DD/MM/YYYY')],
        maxDate: 'today',
        disableMobile: true,
        onChange: async (date) => {
            var datepickerStart = date[0]
            startDate.value = dayjs(datepickerStart).format("YYYY-MM-DD")

            if (date[1]) {
                var datepickerEnd = date[1]
                endDate.value = dayjs(datepickerEnd).format("YYYY-MM-DD")
            }

            if (datepickerStart != undefined && datepickerEnd != undefined) {
                // await getBatchOeeList()
                storeFilterDateIntoCookies()
            }
        },
    })

    // await getProductionLineAccessData()

    // await applyFilter()
})
</script>

<style lang="scss" scoped></style>