<template>
    <div class="mt-1" id="app">
        <div class="table-responsive mt-2">
            <table class="table border-bottom scrollbar text-center">
                <thead>
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Batch No.</th>
                        <th scope="col">Product No.</th>
                        <th scope="col">Machine Name</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">Finish Time</th>
                        <th scope="col">Hours Count</th>
                        <th scope="col">Target Unit</th>
                        <th scope="col">Unit Produced</th>
                        <th scope="col">OEE (%)</th>
                        <th scope="col">Downtime Occured</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(batch, index) in props.paginatedData" :key="'batch' + index">
                        <template v-for="(machine, machineIndex) in batch.machines" :key="'machine' + machineIndex">
                            <tr>
                                <td v-if="machineIndex === 0" :rowspan="batch.machines.length" class="align-middle">
                                    {{ props.calculateIndex(batch.batch_number) }}
                                </td>
                                <td v-if="machineIndex === 0" :rowspan="batch.machines.length" class="align-middle">
                                    {{ batch.batch_number }}
                                </td>
                                <td v-if="machineIndex === 0" :rowspan="batch.machines.length" class="align-middle">
                                    {{ batch.product }}
                                </td>
                                <td class="align-middle">{{ machine.machine_name }}</td>
                                <td class="align-middle">{{ formatDate(machine.start_at) }}</td>
                                <td class="align-middle">{{ formatDate(machine.finish_at) }}</td>
                                <td class="align-middle">{{ machine.hours_count }}</td>
                                <td class="align-middle">{{ machine.plan_quantity }}</td>
                                <td class="align-middle">{{ machine.actual_quantity }}</td>
                                <td class="align-middle">
                                    <h5 class="p-1 text-center" :style="{ color: 'white', backgroundColor: machine.oee > 50 ? 'green' : 'rgb(199, 35, 35)' }">
                                        {{ machine.oee }}
                                    </h5>
                                </td>
                                <td class="align-middle">
                                    <div v-if="batch.downtime.length > 0">
                                        <button type="button" class="btn btn-outline-primary btn-sm shadow-none" @click="toggleCardVisibility(index)">
                                            {{ batch.downtime.length }} Downtime
                                        </button>
                                    </div>
                                    <div v-else>
                                        <button type="button" class="btn btn-outline-primary shadow-none">
                                            No Downtime
                                        </button>
                                    </div>
                                    
                                </td>
                            </tr>
                            <tr v-if="visibleCardIndex === index">
                                <td colspan="12">
                                    <div class="d-flex flex-wrap justify-content-start mb-3 mb-sm-0">
                                        <template v-for="(downtime, downtimeIndex) in batch.downtime" :key="'downtime' + downtimeIndex">
                                            <div class="card border shadow-none m-2" style="min-width: 250px; max-width: 300px;">
                                                <div class="card-body text-start">
                                                    <div><strong>Donwtime Type Name:</strong> {{ downtime.downtime_type_name }}</div>
                                                    <div><strong>Downtime Problem Name:</strong> {{ downtime.downtime_problem_name }}</div>
                                                    <div><strong>Machine Name:</strong> {{ downtime.machine_name }}</div>
                                                    <div><strong>Start Time:</strong> {{ formatDate(downtime.start) }}</div>
                                                    <div><strong>Finish Time:</strong> {{ formatDate(downtime.end) }}</div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const batchNumberIndexMap = ref({})
const visibleCardIndex = ref('')

const props = defineProps({
    paginatedData: {
        type: Object,
        required: true
    },
    calculateIndex: {
        type: Function,
        required: true
    }
})

const toggleCardVisibility = (index) => {
    visibleCardIndex.value = visibleCardIndex.value === index ? null : index
}

function formatDate(dateTime) {
    if (!dateTime || !dayjs(dateTime).isValid()) {
        return '-'
    } else {
        return dayjs(dateTime).format('DD/MM/YYYY hh:mm A')
    }
}
</script>