<template>
    <x-content-header title="Client Account List" class="mb-3" />

    <div class="row gy-2 mt-3">
        <div class="col-md-3">
            <input class="form-control" type="text" placeholder="Search" v-model="search" @keyup="debounceSearch">
        </div>
        <div class="col-md-9 text-end" v-show="$can('client_account.add')">
            <router-link :to="{ name: 'console:client_account.form', params: { action: 'create' } }" class="btn btn-outline-dark px-3">
                <i class="fas fa-plus me-1"></i> New Client Account
            </router-link>
        </div>
    </div>
    <CircleSpinner class="mt-5" v-if="contentLoader == true"/>
    <div class="card mt-3" v-if="contentLoader == false">
        <div class="card-body px-0 pt-0 pb-1">
            <div class="table-reponsive">
                <table class="table table-sm mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th class="fw-bolder">#</th>
                            <th class="fw-bolder">Code</th>
                            <th class="fw-bolder">Company Name</th>
                            <th class="fw-bolder">Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(company, index) in company" v-if="company.length > 0">
                            <th>{{ index + iteration }}</th>
                            <td>{{ company.code }}</td>
                            <td>{{ company.name }}</td>
                            <td>{{ company.email }}</td>
                            <td class="text-end py-0 align-middle">
                                <div class="dropdown dropstart">
                                    <button class="btn btn-icon btn-round btn-text-dark btn-hover-light-dark font-weight-bold" type="button" id="dropdown-active-user" data-bs-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false">
                                        <span class="fas fa-ellipsis fa-2x"></span>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-end border py-2" aria-labelledby="dropdown-active-user">
                                        <router-link :to="{ name: 'console:client_account.form', params: { action: 'edit', company: company.id } }" class="dropdown-item" v-show="$can('client_account.edit')">
                                            <i class="bi bi-pencil fa-lg me-2"></i> Edit
                                        </router-link>
                                        <router-link :to="{ name: 'console:client_account.module_subscriptions.form', params: { action: 'edit', company: company.id } }" class="dropdown-item" v-show="$can('client_account_module_subscriptions.edit')">
                                            <i class="bi bi-plugin me-2"></i> Module Subscriptions
                                        </router-link>
                                        <router-link :to="{ name: 'console:client_account.license_key.index', params: { company: company.id }, query: { name: company.name } }" class="dropdown-item" v-show="$can('license_key.view')">
                                            <i class="bi bi-filetype-key me-2"></i> License Key
                                        </router-link>
                                        <!-- <a class="dropdown-item">
                                            <i class="bi bi-info-square me-2"></i> Profile
                                        </a> -->
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="5" class="text-center">No record found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'

const search = ref('')
const company=ref([])
const pagination = ref([])
const iteration = ref(0)
const contentLoader = ref(false)


const debounceSearch = useDebounceFn (async () =>{
    getClientAccount()
},200)

onMounted(async()=>{
//    (can('client.list')){
        contentLoader.value=true
        await getClientAccount()
        contentLoader.value=false
//     }
})

async function getClientAccount(page=1){
    await window.axios.get(apiRoute({ name:'api:client_account.client_list', query:{ page: page, search: search.value } }))
    .then(function(response){
        company.value = response.data.data
        pagination.value = response.data
        iteration.value = response.data.meta.from
    })
}
</script>
