<template>
    <div class="mb-3">
        <x-content-header title="Packages" />
    </div>

    <div class="row g-3">
        <div class="col-md-4" v-bind:key="index" v-for="(item, index) in packages">
            <div class="card shadow-none">
                <div class="card-body p-0">
                    <div class="border rounded-3 overflow-hidden">
                        <div class="d-flex flex-between-center p-4">
                            <div>
                            <h3 class="fw-light text-primary fs-5 mb-0">{{ item.name }}</h3>
                            <h2 class="fw-light text-primary mt-0"><sup class="fs-1">RM </sup><span class="fs-3">{{ item.starting_price }}</span><span class="fs--2 mt-1">/ month</span></h2>
                            </div>
                            <div class="pe-3"><img src="" width="70" alt="" /></div>
                        </div>
                        <div class="p-4 bg-body-tertiary">
                            <ul class="list-unstyled">
                                <li class="border-bottom py-2"> <span class="fas fa-check text-primary" data-fa-transform="shrink-2"> </span> {{ item.number_of_users }} Users</li>
                                <li class="py-2 border-bottom"><span class="fas fa-check text-primary" data-fa-transform="shrink-2"> </span> {{ item.free_trial_days !== 0 && item.free_trial_days !== null ? item.free_trial_days + ' days' : 'No' }} free trial</li>
                            </ul>
                            <router-link :to="{ name: 'console:package.form', params: { item: item.id } }" class="btn btn-primary d-block w-100" type="button">Modify</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import apiRoute from '@/helpers/ApiHelper'

const packages = ref([])

onMounted(async () => {
    await getListPackage()
})

async function getListPackage() {
    await window.axios.get(apiRoute({ name: 'api:package.list' }))
        .then(response => packages.value = response.data.data)
}
</script>
