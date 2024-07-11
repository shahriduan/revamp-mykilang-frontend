<template>
    <x-content-header
        title="Edit Client Module Subscriptions" class="mb-3"
        :breadcrumbs="[{ route: { name: 'console:client_account.index' }, name: 'Client Account List' }, { name: $route.params.action == 'create' ? 'New Client Account' : companyName }]"
        :previous-route="{ name: 'console:client_account.index' }"
    />

    <div class="card">
        <div class="card-body">
            <label class="form-label" for="package">Package <x-asterisk /></label>
            <br />
            <div class="btn-group mb-3" role="group">
                <button class="btn btn-outline-primary" :class="{ active: subscriptionForm.package.model == listPackage.id }" type="button" :value="listPackage.id" @click="subscriptionToggle(listPackage.name, listPackage.id, listPackage.is_free_trial)" v-bind:key="listPackage.id" v-for="listPackage in listPackages">
                    {{ listPackage.name }}
                </button>
            </div>
            <p class="lead">You choose: <b class="text-danger">{{ subscriptionText }}</b></p>

            <div v-show="packageIsFreeTrial">
                <div class="mb-3">
                    <label class="form-label" for="datepicker">Start Date <x-asterisk /></label>
                    <input class="form-control cursor-pointer" :class="{ 'is-invalid': subscriptionForm.startDate.error }" id="start-date" type="text" v-model="subscriptionForm.startDate.model" />
                    <div class="invalid-feedback">{{ subscriptionForm.startDate.error }}</div>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="datepicker">End Date <x-asterisk /></label>
                    <input class="form-control cursor-pointer" :class="{ 'is-invalid': subscriptionForm.endDate.error }" id="end-date" type="text" v-model="subscriptionForm.endDate.model" />
                    <div class="invalid-feedback">{{ subscriptionForm.endDate.error }}</div>
                </div>
            </div>

            <label class="form-label" for="module">Module <x-asterisk /></label>
            <div class="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                <label class="form-selectgroup-item flex-fill" v-for="listModule in listModules">
                    <input type="checkbox" :checked="isModuleSelected(listModule.id)" @change="toggleModuleSelection(listModule.id)" :id="listModule.id" class="form-selectgroup-input" />
                    <div class="form-selectgroup-label d-flex align-items-center p-3">
                        <div class="me-3">
                            <span class="form-selectgroup-check"></span>
                        </div>
                        <div class="form-selectgroup-label-content d-flex align-items-center">
                            <div class="avatar avatar-xl me-3">
                                <div class="avatar-name rounded-circle"><span>{{ listModule.code }}</span></div>
                            </div>
                            <div>
                                <div class="font-weight-medium">{{ listModule.module_name }}</div>
                                <div class="text-muted">RM {{ listModule.base_price }} / {{ listModule.renew_scheduler }}</div>
                            </div>
                        </div>
                    </div>
                </label>
            </div>
            <span class="text-danger small">{{ subscriptionForm.subscribeModule.error }}</span>
            <div class="col-md-10 mt-3">
                <button type="button" class="btn btn-primary" @click="updateClientModuleSubscription()" :disabled="loader">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true" v-show="loader == true"></span>
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { axiosGetModuleList } from '@/helpers/AxiosApiHelper'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'
import flatpickr from 'flatpickr'
import dayjs from 'dayjs'

const currentRoute = useRoute()

const companyName = ref('')
const subscriptionText = ref('')
const loader = ref(false)
const packageIsFreeTrial = ref(false)

const listPackages = ref([])
const listModules = ref([])
const subscribedModules = ref([])

const subscriptionForm = reactive({
    package: { model: '', error: '' },
    startDate: { model: '', error: '' },
    endDate: { model: '', error: '' },
    subscribeModule: { model: [], error: '' },
})

// const subscriptionModule = computed(() => {
//     return subscriptionForm.subscribeModule.model.filter((value, index) => {
//         return value != null
//     })
// })

onMounted(async () => {
    await getClientAccountDetails()
    await getPackageList()
    await axiosGetModuleList((response) => {
        listModules.value = response.data.data
    })
    await getClientAccountPackageSubscriptions()
    await getClientAccountModuleSubscriptions()
    flatpickr('#start-date, #end-date', {
        dateFormat: 'd/m/Y',
        disableMobile: true
    })
})

async function getClientAccountDetails() {
    await window.axios.get(apiRoute({ name: 'api:client_account.account_details', params: { company: currentRoute.params.company } }))
        .then(function(response) {
            companyName.value = response.data.data.name
        })
}

async function getPackageList() {
    await window.axios.get(apiRoute({ name: 'api:package.list' }))
        .then(function(response) {
            listPackages.value = response.data.data
        })
}

function subscriptionToggle(label, value, isFreeTrial) {
    subscriptionText.value = label
    subscriptionForm.package.model = value
    packageIsFreeTrial.value = isFreeTrial

    if (isFreeTrial == false) {
        subscriptionForm.startDate.model = subscriptionForm.endDate.model = null
        subscriptionForm.startDate.error = subscriptionForm.endDate.error = ''
    }
}

function isModuleSelected(moduleId) {
    return subscriptionForm.subscribeModule.model.includes(moduleId)
}

function toggleModuleSelection(moduleId) {
    const index = subscriptionForm.subscribeModule.model.indexOf(moduleId)
    if (index === -1) {
        subscriptionForm.subscribeModule.model.push(moduleId)
    } else {
        subscriptionForm.subscribeModule.model.splice(index, 1)
    }
}

async function getClientAccountPackageSubscriptions() {
    await window.axios.get(apiRoute({ name: 'api:company.subscribed_package', params: { company: currentRoute.params.company } }))
        .then(function(response) {
            subscriptionForm.package.model = response.data.data[0].package_id
            subscriptionForm.startDate.model = response.data.data[0].start_date
            subscriptionForm.endDate.model = response.data.data[0].end_date

            subscriptionText.value = response.data.data[0].name
            packageIsFreeTrial.value = response.data.data[0].is_free_trial
        })
}

async function getClientAccountModuleSubscriptions() {
    await window.axios.get(apiRoute({ name: 'api:company.subscribed_module', params: { company: currentRoute.params.company } }))
        .then(function(response) {
            subscriptionForm.subscribeModule.model = response.data.data.map(module => module.module_id)

            subscribedModules.value = response.data.data.map(module => module.id)
        })
}

async function updateClientModuleSubscription() {
    loader.value = true

    try {
        const response = await window.axios.post(apiRoute({ name: 'api:client_account.submit_account', params: { action: currentRoute.params.action, company: currentRoute.params.company } }), {
            step: 2,
            package: subscriptionForm.package.model,
            start_date: subscriptionForm.startDate.model ? dayjs(subscriptionForm.startDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            end_date: subscriptionForm.endDate.model ? dayjs(subscriptionForm.endDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            module: subscriptionForm.subscribeModule.model,
            module_unsubscribe: subscribedModules.value,
            company_name: companyName.value
        })

        if (response.data.status == true) {
            snackbar(response.data.message)
        } else {
            const errors = response.data.error
            subscriptionForm.package.error = errors.subscription_type != undefined ? errors.subscription_type[0] : ''
            subscriptionForm.startDate.error = errors.start_date != undefined ? errors.start_date[0] : ''
            subscriptionForm.endDate.error = errors.end_date != undefined ? errors.end_date[0] : ''
            subscriptionForm.subscribeModule.error = errors.module != undefined ? errors.module[0] : ''
        }
    } catch (error) {
        console.error('Error:', error)
    }

    loader.value = false
}
</script>

