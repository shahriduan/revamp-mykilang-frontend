<template>
    <x-content-header
        :title="$route.params.action == 'create' ? 'New Client Account' : 'Edit Client Account'" class="mb-3"
        :breadcrumbs="[{ route: { name: 'console:client_account.index' }, name: 'Client Account List' }, { name: $route.params.action == 'create' ? 'New Client Account' : companyForm.name.model }]"
        :previous-route="{ name: 'console:client_account.index' }"
    />

    <div class="theme-wizard" v-if="$route.params.action == 'create'">
        <ul class="nav justify-content-between nav-wizard">
            <li class="nav-item">
                <a class="nav-link fw-semi-bold" :class="{ 'active': step == 1, 'done': step == 2 || step == 3 }" data-wizard-step="1">
                    <span class="nav-item-circle-parent">
                        <span class="nav-item-circle">
                            <span class="fa-solid fa-building"></span>
                        </span>
                    </span>
                    <span class="d-none d-md-block mt-1 fs--1">Company Information</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-semi-bold" :class="{ 'active': step == 2, 'done': step == 3 }" data-wizard-step="2">
                    <span class="nav-item-circle-parent">
                        <span class="nav-item-circle">
                            <span class="fa-solid fa-network-wired"></span>
                        </span>
                    </span>
                    <span class="d-none d-md-block mt-1 fs--1">Module Subscription</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link fw-semi-bold" :class="{ 'active': step == 3 }" data-wizard-step="3">
                    <span class="nav-item-circle-parent">
                        <span class="nav-item-circle">
                            <span class="fas fa-user"></span>
                        </span>
                    </span>
                    <span class="d-none d-md-block mt-1 fs--1">Root User</span>
                </a>
            </li>
        </ul>
    </div>

    <div class="card" v-show="step == 1">
        <div class="card-body">
            <div class="row mb-3" v-if="$route.params.action == 'create'">
                <label for="company_code" class="col-md-2">Company Code <x-asterisk /></label>
                <div class="col-md-10">
                    <div class="input-group">
                        <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.code.error }" id="company_code" v-model="companyForm.code.model">
                        <button class="btn btn-outline-primary" type="button" data-mdb-ripple-color="dark" @click="autoGenerateCompanyCode">
                            <i class="fa-solid fa-arrows-rotate me-1" :class="{ 'fa-spin' : spinIcon }" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count:1"></i> Auto-generate
                        </button>
                    </div>
                    <div class="text-danger small">{{ companyForm.code.error }}</div>
                    <div class="text-muted small mt-1">Company code can be set only once.</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_name" class="col-md-2">Company Name <x-asterisk /></label>
                <div class="col-md-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.name.error }" id="company_name" v-model="companyForm.name.model" >
                    <div class="invalid-feedback">{{ companyForm.name.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_email" class="col-md-2">Email <x-asterisk /></label>
                <div class="col-md-10">
                    <input type="email" class="form-control" :class="{ 'is-invalid': companyForm.email.error }" id="company_email" v-model="companyForm.email.model" >
                    <div class="invalid-feedback">{{ companyForm.email.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_telephone" class="col-md-2">Telephone</label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.telephone.error }" id="company_telephone" v-model="companyForm.telephone.model" >
                    <div class="invalid-feedback">{{ companyForm.telephone.error }}</div>
                </div>
                <label for="company_fax" class="col-md-2 mt-3 mt-md-0">Fax</label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.fax.error }" id="company_fax" v-model="companyForm.fax.model" >
                    <div class="invalid-feedback">{{ companyForm.fax.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_address_1" class="col-md-2">Address Line 1 <x-asterisk /></label>
                <div class="col-md-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.address_1.error }" id="company_address_1" v-model="companyForm.address_1.model" >
                    <div class="invalid-feedback">{{ companyForm.address_1.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_address_2" class="col-md-2">Address Line 2</label>
                <div class="col-md-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.address_2.error }" id="company_address_2" v-model="companyForm.address_2.model" >
                    <div class="invalid-feedback">{{ companyForm.address_2.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_postcode" class="col-md-2">Postcode <x-asterisk /></label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.postcode.error }" id="company_postcode" v-model="companyForm.postcode.model" >
                    <div class="invalid-feedback">{{ companyForm.postcode.error }}</div>
                </div>
                <label for="company_city" class="col-md-2 mt-3 mt-md-0">City <x-asterisk /></label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.city.error }" id="company_city" v-model="companyForm.city.model" >
                    <div class="invalid-feedback">{{ companyForm.city.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_state" class="col-md-2">State <x-asterisk /></label>
                <div class="col-md-10">
                    <select id="company_state" class="form-select" :class="{ 'is-invalid': companyForm.state.error }" v-model="companyForm.state.model">
                        <option value="">-- Select State --</option>
                        <option :value="state.id" v-for="state in listStates">
                            {{ state.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ companyForm.state.error }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10 offset-md-2">
                    <h6 class="horizontal-line-header">
                        <span class="horizontal-line-text" id="register-company">Additional Information</span>
                    </h6>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_website" class="col-md-2">Website</label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.website.error }" id="company_website" v-model="companyForm.website.model" >
                    <div class="invalid-feedback">{{ companyForm.website.error }}</div>
                </div>
                <label for="company_sector" class="col-md-2 mt-3 mt-md-0">Sector</label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': companyForm.sector.error }" id="company_sector" v-model="companyForm.sector.model" >
                    <div class="invalid-feedback">{{ companyForm.sector.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="company_information" class="col-md-2">Company Information</label>
                <div class="col-md-10">
                    <textarea id="company_information" class="form-control" :class="{ 'is-invalid': companyForm.company_information.error }" rows="3" style="resize: none;" v-model="companyForm.company_information.model"></textarea>
                    <div class="invalid-feedback">{{ companyForm.company_information.error }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10 offset-md-2">
                    <div v-if="$route.params.action == 'create'">
                        <button type="button" class="btn btn-primary" @click="registerClientAccount(1)" :disabled="loader">
                            <i class="fa-solid fa-arrow-right"></i> Next
                        </button>
                    </div>
                    <div v-else>
                        <button type="button" class="btn btn-primary" @click="registerClientAccount(1)" :disabled="loader">
                            <span class="spinner-border spinner-border-sm" aria-hidden="true" v-show="loader == true"></span>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card" v-show="step == 2">
        <div class="card-body">
            <div class="btn-group mb-3" role="group">
                <button class="btn btn-outline-primary" :class="{ active: subscriptionForm.package.model == listPackage.id }" type="button" :value="listPackage.id" @click="subscriptionToggle(listPackage.name, listPackage.id, listPackage.is_free_trial)" v-for="listPackage in listPackages">
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

            <label class="form-label" for="datepicker">Module <x-asterisk /></label>
            <div class="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                <label class="form-selectgroup-item flex-fill" v-for="listModule in listModules">
                    <input type="checkbox" name="checkboxModule[]" v-bind:id="listModule.id" v-model="subscriptionForm.subsribeModule.model[listModule.id]" :true-value="listModule.id" :false-value="null" class="form-selectgroup-input" />
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
            <span class="text-danger small">{{ subscriptionForm.subsribeModule.error }}</span>
            <div class="row mt-3">
                <div class="col-md-10">
                    <button type="button" class="btn btn-secondary me-2" @click="previousStep(1)">
                        <i class="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <button type="button" class="btn btn-primary" @click="registerClientAccount(2)" :disabled="loader">
                        <i class="fa-solid fa-arrow-right"></i> Next
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="card" v-show="step == 3">
        <div class="card-body">
            <div class="row mb-3">
                <label for="full_name" class="col-sm-2">Full Name <x-asterisk /></label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': rootUserForm.fullname.error }" id="full_name" v-model="rootUserForm.fullname.model">
                    <div class="invalid-feedback">{{ rootUserForm.fullname.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="email" class="col-sm-2">Email <x-asterisk /></label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': rootUserForm.email.error }" id="email" v-model="rootUserForm.email.model">
                    <div class="invalid-feedback">{{ rootUserForm.email.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="username" class="col-sm-2">Username <x-asterisk /></label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': rootUserForm.username.error }" id="username" v-model="rootUserForm.username.model">
                    <div class="invalid-feedback">{{ rootUserForm.username.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="password" class="col-sm-2">Password <x-asterisk /></label>
                <div class="col-sm-10">
                    <div class="input-group">
                        <input type="text" class="form-control" :class="{ 'is-invalid': rootUserForm.password.error }" id="password" v-model="rootUserForm.password.model">
                        <button class="btn btn-outline-primary" type="button" data-mdb-ripple-color="dark" @click="autoGeneratePassword">
                            <i class="fa-solid fa-arrows-rotate me-1" :class="{ 'fa-spin' : spinIcon }" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count:1"></i> Auto-generate
                        </button>
                    </div>
                    <div class="text-danger small mt-1">{{ rootUserForm.password.error }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-2">
                    <button type="button" class="btn btn-secondary" @click="previousStep(2)">
                        <i class="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <button type="button" class="btn btn-primary ms-2" @click="registerClientAccount(3)" :disabled="loader">
                        <span class="spinner-border spinner-border-sm" aria-hidden="true" v-show="loader == true"></span>
                        Register
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { axiosGetStateOfCountry, axiosGetModuleList } from '@/helpers/AxiosApiHelper'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'
import UtilityHelper from '@/helpers/UtilityHelper'
import flatpickr from 'flatpickr'
import dayjs from 'dayjs'

const currentRoute = useRoute()
const router = useRouter()

const step = ref(1)
const spinIcon = ref(false)
const loader = ref(false)
const subscriptionText = ref('')
const packageIsFreeTrial = ref(false)

const listStates = ref([])
const listModules = ref([])
const listPackages = ref([])

const companyForm = reactive({
    code: { model: '', error: '' },
    name: { model: '', error: '' },
    email: { model: '', error: '' },
    telephone: { model: '', error: '' },
    fax: { model: '', error: '' },
    address_1: { model: '', error: '' },
    address_2: { model: '', error: '' },
    postcode: { model: '', error: '' },
    city: { model: '', error: '' },
    state: { model: '', error: '' },
    website: { model: '', error: '' },
    sector: { model: '', error: '' },
    company_information: { model: '', error: '' }
})

const subscriptionForm = reactive({
    package: { model: '', error: '' },
    startDate: { model: '', error: '' },
    endDate: { model: '', error: '' },
    subsribeModule: { model: [], error: '' }
})

const subscriptionModule = computed(() => {
    return subscriptionForm.subsribeModule.model.filter((value, index) => {
        return value != null
    })
})

const rootUserForm = reactive({
    fullname: { model: '', error: '' },
    email: { model: '', error: '' },
    username: { model: '', error: '' },
    password: { model: '', error: '' }
})

onMounted(async () => {
    await axiosGetStateOfCountry((response) => {
        listStates.value = response.data.data
    })

    if (currentRoute.params.action == 'edit') {
        await getClientAccountDetails()
    }

    if (currentRoute.params.action == 'create') {
        await axiosGetModuleList((response) => {
            listModules.value = response.data.data
        })

        flatpickr('#start-date, #end-date', {
            dateFormat: 'd/m/Y',
            disableMobile: true
        })

        await getPackages()
    }
})

async function getPackages() {
    await window.axios.get(apiRoute({ name: 'api:package.list' }))
        .then(function(response) {
            listPackages.value = response.data.data

            subscriptionForm.package.model = listPackages.value[0].id
            subscriptionText.value = listPackages.value[0].name
            packageIsFreeTrial.value = listPackages.value[0].is_free_trial
        })
}

function subscriptionToggle(label, value, isFreeTrial) {
    subscriptionText.value = label
    subscriptionForm.package.model = value
    packageIsFreeTrial.value = isFreeTrial

    if (isFreeTrial == false) {
        subscriptionForm.startDate.model = subscriptionForm.startDate.error = subscriptionForm.endDate.model = subscriptionForm.endDate.error = ''
    }
}

function autoGenerateCompanyCode() {
    spinIcon.value = true

    const upperCase = 'ABZDEFGHIJKLMNOPQRSTUVWXYZ'

    var utilityHelper = new UtilityHelper
    var companyCode = utilityHelper.generateRandomString(6, upperCase)

    companyForm.code.model = companyCode

    setTimeout(() => {
        spinIcon.value = false
    }, 500)
}

function autoGeneratePassword() {
    spinIcon.value = true

    const upperCase = 'ABZDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
    const number = '1234567890'

    var utilityHelper = new UtilityHelper
    var randomUpperCase = utilityHelper.generateRandomString(2, upperCase)
    var randomLowerCase = utilityHelper.generateRandomString(4, lowerCase)
    var randomNumber = utilityHelper.generateRandomString(2, number)

    var combine = randomUpperCase + randomLowerCase + '@' + randomNumber
    rootUserForm.password.model = combine

    setTimeout(() => {
        spinIcon.value = false
    }, 500);
}

function previousStep(previousStepNumber) {
    step.value = previousStepNumber
}

async function getClientAccountDetails() {
    await window.axios.get(apiRoute({ name: 'api:client_account.account_details', params: { company:  currentRoute.params.company } }))
        .then(function(response) {
            companyForm.name.model = response.data.data.name
            companyForm.email.model = response.data.data.email
            companyForm.telephone.model = response.data.data.telephone
            companyForm.fax.model = response.data.data.fax
            companyForm.address_1.model = response.data.data.address_1
            companyForm.address_2.model = response.data.data.address_2
            companyForm.postcode.model = response.data.data.postcode
            companyForm.city.model = response.data.data.city
            companyForm.state.model = response.data.data.state_id
            companyForm.website.model = response.data.data.website
            companyForm.sector.model = response.data.data.sector
            companyForm.company_information.model = response.data.data.company_information
        })
}

async function registerClientAccount(stepNumber) {
    loader.value = true

    var parameter = currentRoute.params.action == 'create' ? { action: currentRoute.params.action } : { action: currentRoute.params.action, company: currentRoute.params.company }

    await window.axios.post(apiRoute({ name: 'api:client_account.submit_account', params: parameter }), {
            step: stepNumber,
            company_code: companyForm.code.model,
            company_name: companyForm.name.model,
            company_email: companyForm.email.model,
            company_phone: companyForm.telephone.model,
            company_fax: companyForm.fax.model,
            address_line_1: companyForm.address_1.model,
            address_line_2: companyForm.address_2.model,
            postcode: companyForm.postcode.model,
            city: companyForm.city.model,
            state: companyForm.state.model,
            website: companyForm.website.model,
            sector: companyForm.sector.model,
            company_information: companyForm.company_information.model,
            package: subscriptionForm.package.model,
            start_date: subscriptionForm.startDate.model != '' ? dayjs(subscriptionForm.startDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            end_date: subscriptionForm.endDate.model != '' ? dayjs(subscriptionForm.endDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            module: subscriptionModule.value,
            fullname: rootUserForm.fullname.model,
            email: rootUserForm.email.model,
            username: rootUserForm.username.model,
            password: rootUserForm.password.model
        })
        .then(function(response) {
            if (response.data.status == true) {
                if (currentRoute.params.action == 'create' && step.value == 3) {
                    rootUserForm.fullname.model = rootUserForm.email.model = rootUserForm.username.model = rootUserForm.password.model = ''
                    snackbar(response.data.message)
                    router.push({ name: 'console:client_account.index' })
                }

                if (currentRoute.params.action == 'create' && step.value == 2) {
                    subscriptionForm.package.error = subscriptionForm.startDate.error = subscriptionForm.endDate.error = subscriptionForm.subsribeModule.error =  ''
                    step.value = 3
                }

                if (step.value == 1) {
                    companyForm.code.error = companyForm.name.error = companyForm.email.error = companyForm.telephone.error = companyForm.fax.error = companyForm.address_1.error = companyForm.address_2.error = companyForm.postcode.error = companyForm.city.error = companyForm.state.error = companyForm.website.error = companyForm.sector.error = companyForm.company_information.error = ''

                    // Create
                    if (currentRoute.params.action == 'create') {
                        step.value = 2
                    // Edit
                    } else {
                        snackbar(response.data.message)
                    }
                }
            } else {
                companyForm.code.error = response.data.error.company_code != undefined ? response.data.error.company_code[0] : ''
                companyForm.name.error = response.data.error.company_name != undefined ? response.data.error.company_name[0] : ''
                companyForm.email.error = response.data.error.company_email != undefined ? response.data.error.company_email[0] : ''
                companyForm.telephone.error = response.data.error.company_phone != undefined ? response.data.error.company_phone[0] : ''
                companyForm.fax.error = response.data.error.company_fax != undefined ? response.data.error.company_fax[0] : ''
                companyForm.address_1.error = response.data.error.address_line_1 != undefined ? response.data.error.address_line_1[0] : ''
                companyForm.address_2.error = response.data.error.address_line_2 != undefined ? response.data.error.address_line_2[0] : ''
                companyForm.postcode.error = response.data.error.postcode != undefined ? response.data.error.postcode[0] : ''
                companyForm.city.error = response.data.error.city != undefined ? response.data.error.city[0] : ''
                companyForm.state.error = response.data.error.state != undefined ? response.data.error.state[0] : ''
                companyForm.website.error = response.data.error.website != undefined ? response.data.error.website[0] : ''
                companyForm.sector.error = response.data.error.sector != undefined ? response.data.error.sector[0] : ''
                companyForm.company_information.error = response.data.error.company_information != undefined ? response.data.error.company_information[0] : ''

                subscriptionForm.package.error = response.data.error.subscription_type != undefined ? response.data.error.subscription_type[0] : ''
                subscriptionForm.startDate.error = response.data.error.start_date != undefined ? response.data.error.start_date[0] : ''
                subscriptionForm.endDate.error = response.data.error.end_date != undefined ? response.data.error.end_date[0] : ''
                subscriptionForm.subsribeModule.error = response.data.error.module != undefined ? response.data.error.module[0] : ''

                rootUserForm.fullname.error = response.data.error.fullname != undefined ? response.data.error.fullname[0] : ''
                rootUserForm.username.error = response.data.error.username != undefined ? response.data.error.username[0] : ''
                rootUserForm.email.error = response.data.error.email != undefined ? response.data.error.email[0] : ''
                rootUserForm.password.error = response.data.error.password != undefined ? response.data.error.password[0] : ''
            }
        })

    loader.value = false
}
</script>
