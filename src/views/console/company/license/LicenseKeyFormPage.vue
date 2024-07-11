<template>
    <x-content-header
        :title="$route.params.action == 'create' ? 'New License Key' : 'Edit License Key'"
        :breadcrumbs="[
            { route: { name: 'console:client_account.index'}, name: 'Client Accounts' },
            { route: { name: 'console:client_account.license_key.index', params: { company: $route.params.company }, query: { name: $route.query.name } }, name: $route.query.name + ' Licenses' },
            { name: $route.params.action == 'create' ? 'New License Key' : 'Edit License Key' }
        ]"
        :previous-route="{ name: 'console:client_account.license_key.index', params: { company: $route.params.company }, query: { name: $route.query.name } }"
    />

    <div class="card mt-4">
        <div class="card-body">
            <div class="row mb-3">
                <label for="full_name" class="col-sm-2">Label <x-asterisk /></label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': form.label.error }" id="full_name" v-model="form.label.model">
                    <div class="invalid-feedback">{{ form.label.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="start_date" class="col-sm-2">Start Date <x-asterisk /></label>
                <div class="col-sm-10">
                    <input type="text" class="form-control cursor-pointer" :class="{ 'is-invalid': form.start.error }" id="start_date" v-model="form.start.model">
                    <div class="invalid-feedback">{{ form.start.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="start_date" class="col-sm-2">End Date <x-asterisk /></label>
                <div class="col-sm-10">
                    <input type="text" class="form-control cursor-pointer" :class="{ 'is-invalid': form.end.error }" id="end_date" v-model="form.end.model">
                    <div class="invalid-feedback">{{ form.end.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 pt-0">Status <x-asterisk /></label>
                <div class="col-sm-10">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" :class="{ 'is-invalid': form.status.error }" type="radio" name="user-status" id="status-active" v-model="form.status.model" :value="true" />
                        <label class="form-check-label mb-0 pb-0" for="status-active">Active</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" :class="{ 'is-invalid': form.status.error }" type="radio" name="user-status" id="status-inactive" v-model="form.status.model" :value="false" />
                        <label class="form-check-label mb-0 pb-0" for="status-inactive">Inactive</label>
                    </div>
                    <div class="text-danger small">{{ form.status.error }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="button" class="btn btn-primary" @click="submit" :disabled="loader">
                        <span class="spinner-border spinner-border-sm me-1" v-show="loader"></span>
                        {{ loader == true ? 'Saving ...' : $route.params.action == 'create' ? 'Generate License' : 'Update License' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiRoute from '@/helpers/ApiHelper'
import { snackbar } from '@/components/Snackbar'
import dayjs from 'dayjs'
import flatpickr from 'flatpickr'

const currentRoute = useRoute()
const router = useRouter()

const loader = ref(false)

const form = reactive({
    label: { model: '', error: '' },
    start: { model: '', error: '' },
    end: { model: '', error: '' },
    status: { model: true, error: '' },
})

onMounted(async () => {
    flatpickr('#start_date, #end_date', {
        dateFormat: 'd/m/Y',
        disableMobile: true
    })

    if (currentRoute.params.action == 'edit') {
        await getLicenseDetails()
    }
})

async function getLicenseDetails() {
    await window.axios.get(apiRoute({ name: 'api:company.license_details', params: { license: currentRoute.params.license } }))
        .then(function(response) {
            form.label.model = response.data.data.label_name
            form.start.model = dayjs(response.data.data.start_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
            form.end.model = dayjs(response.data.data.end_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
            form.status.model = response.data.data.status
        })
}

async function submit() {
    loader.value = true

    var parameter = currentRoute.params.action == 'create' ? { action: currentRoute.params.action } : { action: currentRoute.params.action, license: currentRoute.params.license }

    await window.axios.post(apiRoute({ name: 'api:company.submit_license', params: parameter }), {
            label_name: form.label.model,
            start_date: form.start.model != '' ? dayjs(form.start.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            end_date: form.end.model != '' ? dayjs(form.end.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            status: form.status.model,
            company_id: currentRoute.params.company
        })
        .then(function(response) {
            if (response.data.status == true) {
                snackbar(response.data.message)
                router.push({ name: 'console:client_account.license_key.index', params: { company: currentRoute.params.company }, query: { name: currentRoute.query.name } })
            } else {
                form.label.error = response.data.error.label_name != undefined ? response.data.error.label_name[0] : ''
                form.start.error = response.data.error.start_date != undefined ? response.data.error.start_date[0] : ''
                form.end.error = response.data.error.end_date != undefined ? response.data.error.end_date[0] : ''
                form.status.error = response.data.error.status != undefined ? response.data.error.status[0] : ''
            }
        })
        .catch(function(error) {
            snackbar('Error: Unable to save license key.')
        })

    loader.value = false
}
</script>
