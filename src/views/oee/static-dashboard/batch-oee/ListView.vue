<template>
    <div class="col-12 mb-1 mt-1 p-0 container" v-for="(batch, batchIndex) in props.paginatedData" :key="'batch' + batchIndex">
        <div v-for="(machine, machineIndex) in batch.machines" :key="'machine' + machineIndex">
            <div class="card border shadow-none h-100">
                <a class="btn p-0" :data-bs-toggle="'collapse'"
                    :href="'#collapse-' + batchIndex + '-' + machineIndex" role="button" aria-expanded="false"
                    :aria-controls="'collapse-' + batchIndex + '-' + machineIndex">
                    <div class="card-body">
                        <div class="d-flex flex-wrap">
                            <div class="w-100 text-center">
                                <h5 :style="{ color: 'white', backgroundColor: machine.oee > 50 ? 'green' : 'rgb(199, 35, 35)' }">
                                    OEE: {{ machine.oee }}%
                                </h5>
                            </div>
                            <div class="w-100 text-start p-0">
                                <div><span style="font-weight: bold;">Batch Number:</span> {{ batch.batch_number }}</div>
                            </div>
                        </div>
                        <div class="d-flex flex-wrap text-start">
                            <div><span style="font-weight: bold;">Product No.:</span> {{ batch.product }}</div>
                        </div>
                        <div class="d-flex flex-wrap justify-content-between">
                            <div class="text-start">Unit Produced <span class="fw-bold h5">{{ machine.actual_quantity }}</span>/Target Unit {{ machine.plan_quantity }}</div>
                            <span><i class="fas fa-chevron-down" style="font-weight: bold; color: black;"></i></span>
                        </div>
                    </div>
                </a>
            </div>
            <div :id="'collapse-' + batchIndex + '-' + machineIndex" class="collapse">
                <div class="card border shadow-none p-3">
                    <div>
                        <p class="mb-0"><strong>Machine Name:</strong> {{ machine.machine_name }}</p>
                        <p class="mb-0"><strong>Start Time:</strong> {{ formatDate(machine.start_at) }}</p>
                        <p class="mb-0"><strong>Finish Time:</strong> {{ formatDate(machine.finish_at) }}</p>
                        <p class="mb-0"><strong>Plan Quantity:</strong> {{ machine.plan_quantity }}</p>
                        <p class="mb-0"><strong>Actual Quantity:</strong> {{ machine.actual_quantity }}</p>
                        <p class="mb-1"><strong>Hours Count:</strong> {{ machine.hours_count }}</p>
                        <p class="mb-2"><strong>OEE:</strong> <span class="h5 p-1" :style="{ color: 'white', backgroundColor: machine.oee > 50 ? 'green' : 'rgb(199, 35, 35)' }">{{ machine.oee }}%</span></p>
                        <p class="text-center text-white mb-0" style="background-color: #152b48;"><strong>Downtime:</strong></p>
                        <div v-if="batch.downtime.length > 0">
                            <div v-for="(downtime, downtimeIndex) in batch.downtime" :key="'downtime' + downtimeIndex">
                                <div class="card border shadow-none rounded-0">
                                    <div class="card-body p-2">
                                        <div><strong>Donwtime Type Name:</strong> {{ downtime.downtime_type_name }}</div>
                                        <div><strong>Downtime Problem Name:</strong> {{ downtime.downtime_problem_name }}</div>
                                        <div><strong>Machine Name:</strong> {{ downtime.machine_name }}</div>
                                        <div><strong>Start Time:</strong> {{ formatDate(downtime.start) }}</div>
                                        <div><strong>Finish Time:</strong> {{ formatDate(downtime.end) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="card border shadow-none rounded-0">
                                <div class="card-body p-2 text-center fw-bold">
                                    No Downtime Occured
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
    paginatedData: {
        type: Object
    },
    calculateIndex: {
        type: Function
    }
})

function formatDate(dateTime) {
    if (!dateTime || !dayjs(dateTime).isValid()) {
        return '-'
    } else {
        return dayjs(dateTime).format('DD/MM/YYYY hh:mm A')
    }
}
</script>

<style scoped>
.container {
    flex-wrap: nowrap;
}
</style>