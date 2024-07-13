<template>
    <PageHeaderTitle>
        <h5>Production Raw Data</h5>
    </PageHeaderTitle>
    
    <select class="form-select form-select-md mt-3" v-model="selectedFactory" @change="getRawOee">
        <option value="">All Factory</option>
        <option v-for="factory in factories" :value="factory.id">{{ factory.name }}</option>
    </select>

    <div class="mt-3">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive scrollbar">
                    <table class="table table-bordered overflow-hidden">
                        <thead class="table-primary">
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Factory</th>
                                <th scope="col">Production Line</th>
                                <th scope="col">Product</th>
                                <th scope="col">Shift</th>
                                <th scope="col">OEE (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="align-middle" v-if="oees.length > 0" v-for="oee in oees">
                                <td class="text-nowrap">{{ oee.date }}</td>
                                <td class="text-nowrap">{{ oee.factory }}</td>
                                <td class="text-nowrap">{{ oee.production_line }}</td>
                                <td class="text-nowrap">{{ oee.part }}</td>
                                <td class="text-nowrap">{{ oee.shift }}</td>
                                <td class="text-nowrap">{{ oee.oee }}</td>
                            </tr>
                            <tr v-else>
                                <td colspan="6" class="text-center">No Data.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import apiRoute from '@/helpers/ApiHelper'
import PageHeaderTitle from '@/views/oee/_shared/PageHeaderTitle.vue'

const oees = ref([])
const factories = ref([])

const selectedFactory = ref('')

onMounted(async () => {
    await getAccessableFactoryList()

    useIntervalFn(async () => {
        await getRawOee()
    }, 30000, {
        immediateCallback: true
    })
})

async function getRawOee() {
    await window.axios.get(apiRoute({ name: 'api_oee:raw_oee', query: { factory: selectedFactory.value} }))
        .then((response) => {
            oees.value = response.data.data
        })
}

async function getAccessableFactoryList() {
    await window.axios.get(apiRoute({ name: 'api:user_profile' }))
        .then((response) => {
            factories.value = response.data.data.factory
        })
}
</script>