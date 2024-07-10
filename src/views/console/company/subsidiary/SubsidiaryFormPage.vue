<template>
    <x-content-header 
        :title="$route.params.action == 'create' ? 'New Subsidiary' : 'Edit Subsidiary'" class="mb-3"
        :breadcrumbs="[{ route: { name: 'my_company' }, name: 'My Company' }, { name: $route.params.action == 'create' ? 'New Subsidiary' : breadcrumbTitle }]"
        :previous-route="{ name: 'my_company' }"
    />

    <Circlespinner v-if="contentLoader == true" />
    <div class="card mt-3" v-if="contentLoader == false">
        <div class="card-body">
            <div class="row mb-2">
                <label for="subsidiary_name" class="col-md-2">
                    Name <span class="text-danger">*</span>
                </label>
                <div class="col-md-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.name.error }" id="subsidiary_name" v-model="subsidiaryForm.name.model">
                    <div class="invalid-feedback">{{ subsidiaryForm.name.error }}</div>
                    <div class="mt-2" @click="companyAccountDetails">
                        <input class="form-check-input me-2" type="checkbox" v-model="selectCompanyDetails">
                        <label class="form-check-label">Use the same information from the main company</label>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="email" class="col-md-2">
                    Email <span class="text-danger">*</span>
                </label>
                <div class="col-md-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.email.error }" id="email" v-model="subsidiaryForm.email.model">
                    <div class="invalid-feedback">{{ subsidiaryForm.email.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="telephone" class="col-md-2">Telephone</label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.telephone.error }" id="telephone" v-model="subsidiaryForm.telephone.model" >
                    <div class="invalid-feedback">{{ subsidiaryForm.telephone.error }}</div>
                </div>
                <label for="fax" class="col-md-2 mt-3 mt-md-0">Fax</label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.fax.error }" id="fax" v-model="subsidiaryForm.fax.model" >
                    <div class="invalid-feedback">{{ subsidiaryForm.fax.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="address_1" class="col-md-2">
                    Address Line 1 <span class="text-danger">*</span>
                </label>
                <div class="col-md-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.address_1.error }" id="address_1" v-model="subsidiaryForm.address_1.model" >
                    <div class="invalid-feedback">{{ subsidiaryForm.address_1.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="address_2" class="col-md-2">
                    Address Line 2
                </label>
                <div class="col-md-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.address_2.error }" id="address_2" v-model="subsidiaryForm.address_2.model" >
                    <div class="invalid-feedback">{{ subsidiaryForm.address_2.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="postcode" class="col-md-2">
                    Postcode <span class="text-danger">*</span>
                </label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.postcode.error }" id="postcode" v-model="subsidiaryForm.postcode.model" >
                    <div class="invalid-feedback">{{ subsidiaryForm.postcode.error }}</div>
                </div>
                <label for="city" class="col-md-2 mt-3 mt-md-0">
                    City <span class="text-danger">*</span>
                </label>
                <div class="col-md-4">
                    <input type="text" class="form-control" :class="{ 'is-invalid': subsidiaryForm.city.error }" id="city" v-model="subsidiaryForm.city.model" >
                    <div class="invalid-feedback">{{ subsidiaryForm.city.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="state" class="col-md-2">
                    State <span class="text-danger">*</span>
                </label>
                <div class="col-md-10">
                    <select class="form-select text-secondary" :class="{ 'is-invalid': subsidiaryForm.state.error }" v-model="subsidiaryForm.state.model">
                        <option value=""> Choose state </option>
                        <option :value="state.id" v-for="state in stateList">
                            {{ state.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ subsidiaryForm.state.error }}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="button" class="btn btn-primary" @click="submitSubsidiary" :disabled="submitLoader">
                        <span class="spinner-border spinner-border-sm me-1" v-show="submitLoader"></span>
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { axiosGetStateOfCountry } from '@/helpers/AxiosApiHelper'
import { snackbar } from '@/components/Snackbar'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import Circlespinner from '@/components/CircleSpinner.vue'
import apiRoute from '@/helpers/ApiHelper'

const authStore = useAuthStore()
const breadcrumbTitle = ref('')
const currentRoute = useRoute()
const stateList = ref([])
const contentLoader = ref(false)
const submitLoader = ref(false)
const subsidiaryForm = reactive({
    name: { model: '', error: '' },
    email: { model: '', error: '' },
    telephone: { model: '', error: '' },
    fax: { model: '', error: '' },
    address_1: { model: '', error: '' },
    address_2: { model: '', error: '' },
    postcode: { model: '', error: '' },
    city: { model: '', error: '' },
    state: { model: '', error: '' },
})
const selectCompanyDetails = ref (false)

onMounted(async () => {
    if (currentRoute.params.action == 'edit') {
        contentLoader.value = true
    }

    await axiosGetStateOfCountry((response) => {
        stateList.value = response.data.data
    })

    if (currentRoute.params.action == 'edit') {
        await getSubsidiaryDetails()
        contentLoader.value = false
    }
})

function companyAccountDetails() {
    if ( selectCompanyDetails.value == true ) {
        selectCompanyDetails.value = false
    } else {
        selectCompanyDetails.value = true
        getClientAccountDetails()
    }
}

async function getSubsidiaryDetails() {
    await window.axios.get(apiRoute({ name: 'api:subsidiary.details', params: { subsidiary: currentRoute.params.subsidiary} }))
        .then(function(response) {
            subsidiaryForm.name.model = breadcrumbTitle.value = response.data.data.subsidiary_name
            subsidiaryForm.email.model = response.data.data.email
            subsidiaryForm.telephone.model = response.data.data.telephone
            subsidiaryForm.fax.model = response.data.data.fax
            subsidiaryForm.address_1.model = response.data.data.address_1
            subsidiaryForm.address_2.model = response.data.data.address_2
            subsidiaryForm.postcode.model = response.data.data.postcode
            subsidiaryForm.city.model = response.data.data.city
            subsidiaryForm.state.model = response.data.data.state_id
        })
}

async function getClientAccountDetails() {
    await window.axios.get(apiRoute({ name: 'api:client_account.account_details', params: { company: authStore.userProfile.company_id}  } ))
        .then(function(response) {
            subsidiaryForm.email.model = response.data.data.email
            subsidiaryForm.telephone.model = response.data.data.telephone
            subsidiaryForm.fax.model = response.data.data.fax
            subsidiaryForm.address_1.model = response.data.data.address_1
            subsidiaryForm.address_2.model = response.data.data.address_2
            subsidiaryForm.postcode.model = response.data.data.postcode
            subsidiaryForm.city.model = response.data.data.city
            subsidiaryForm.state.model = response.data.data.state_id
        })
}

async function submitSubsidiary() {
    submitLoader.value = true

    var parameter = currentRoute.params.action == 'create' ? { action: currentRoute.params.action } : { action: currentRoute.params.action, subsidiary: currentRoute.params.subsidiary }

    await window.axios.post(apiRoute({ name: 'api:company.submit_subsidiary', params: parameter }), {
            subsidiary_name: subsidiaryForm.name.model,
            email: subsidiaryForm.email.model,
            telephone: subsidiaryForm.telephone.model,
            fax: subsidiaryForm.fax.model,
            address_1: subsidiaryForm.address_1.model,
            address_2: subsidiaryForm.address_2.model,
            postcode: subsidiaryForm.postcode.model,
            city: subsidiaryForm.city.model,
            state: subsidiaryForm.state.model,
            company_id: authStore.userProfile.company_id,
        })
        .then(function(response) {
            if (response.data.status == true) {
                if (currentRoute.params.action == 'create') {
                    subsidiaryForm.name.model = subsidiaryForm.email.model = subsidiaryForm.telephone.model = subsidiaryForm.fax.model = subsidiaryForm.address_1.model = subsidiaryForm.address_2.model = subsidiaryForm.postcode.model = subsidiaryForm.city.model = subsidiaryForm.state.model = ''
                }

                subsidiaryForm.name.error = subsidiaryForm.email.error = subsidiaryForm.telephone.error = subsidiaryForm.fax.error = subsidiaryForm.address_1.error = subsidiaryForm.address_2.error = subsidiaryForm.postcode.error = subsidiaryForm.city.error = subsidiaryForm.state.error = ''

                snackbar(response.data.message)
            } else {
                subsidiaryForm.name.error = response.data.error.subsidiary_name != undefined ? response.data.error.subsidiary_name[0] : ''
                subsidiaryForm.email.error = response.data.error.email != undefined ? response.data.error.email[0] : ''
                subsidiaryForm.telephone.error = response.data.error.telephone != undefined ? response.data.error.telephone[0] : ''
                subsidiaryForm.fax.error = response.data.error.fax != undefined ? response.data.error.fax[0] : ''
                subsidiaryForm.address_1.error = response.data.error.address_1 != undefined ? response.data.error.address_1[0] : ''
                subsidiaryForm.address_2.error = response.data.error.address_2 != undefined ? response.data.error.address_2[0] : ''
                subsidiaryForm.postcode.error = response.data.error.postcode != undefined ? response.data.error.postcode[0] : ''
                subsidiaryForm.city.error = response.data.error.city != undefined ? response.data.error.city[0] : ''
                subsidiaryForm.state.error = response.data.error.state != undefined ? response.data.error.state[0] : ''
            }
        })

    submitLoader.value = false
}
</script>