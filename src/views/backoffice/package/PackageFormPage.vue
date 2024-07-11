<template>
    <x-content-header
        title="Edit Package"
        :breadcrumbs="[{ route: { name: 'console:package.list' }, name: 'Packages'}, { name: 'Edit Package' }]"
        :previous-route="{ name: 'console:package.list' }"
    />

    <div class="card mt-4">
        <div class="card-body">
            <div class="row mb-3">
                <label class="col-md-2" for="package_name">Name <x-asterisk /></label>
                <div class="col-md-10">
                    <input class="form-control" id="package_name" :class="{ 'is-invalid': formPackage.name.error }" v-model="formPackage.name.model" type="text" />
                    <div class="invalid-feedback">{{ formPackage.name.error }}</div>
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-md-2" for="package_description">Description</label>
                <div class="col-md-10">
                    <textarea class="form-control resize-none" id="package_description" :class="{ 'is-invalid': formPackage.description.error }" v-model="formPackage.description.model" rows="3"></textarea>
                    <div class="invalid-feedback">{{ formPackage.description.error }}</div>
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-md-2" for="starting_price">Starting Price <x-asterisk /></label>
                <div class="col-md-10">
                    <input class="form-control w-md-50" id="starting_price" :class="{ 'is-invalid': formPackage.starting_price.error }" v-model="formPackage.starting_price.model" type="number" min="0.00" />
                    <div class="invalid-feedback">{{ formPackage.starting_price.error }}</div>
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-md-2" for="number_of_users">Number of Users <x-asterisk /></label>
                <div class="col-md-10">
                    <input class="form-control w-md-50" id="number_of_users" :class="{ 'is-invalid': formPackage.number_of_users.error }" v-model="formPackage.number_of_users.model" type="number" min="0"/>
                    <div class="invalid-feedback">{{ formPackage.number_of_users.error }}</div>
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-md-2" for="free_trial_days">Free Trial Days</label>
                <div class="col-sm-10">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="free_trial_option" id="free-trial-yes" v-model="formPackage.free_trial_option.model" :value="true" />
                        <label class="form-check-label mb-0 pb-0" for="free-trial-yes">Yes</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="free_trial_option" id="free-trial-no" v-model="formPackage.free_trial_option.model" :value="false" />
                        <label class="form-check-label mb-0 pb-0" for="free-trial-no">No</label>
                    </div>
                </div>
                <div v-if="formPackage.free_trial_option.model === true">
                    <div class="col-md-10 offset-md-2">
                        <input class="form-control w-md-50" id="free_trial_days" :class="{ 'is-invalid': formPackage.free_trial_days.error }" v-model="formPackage.free_trial_days.model" type="number" />
                        <div class="invalid-feedback">{{ formPackage.free_trial_days.error }}</div>
                    </div>
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-md-2">Status <x-asterisk /></label>
                <div class="col-sm-10">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" :class="{ 'is-invalid': formPackage.is_active.error }" type="radio" name="is_active" id="status-active" v-model="formPackage.is_active.model" :value="true" />
                        <label class="form-check-label mb-0 pb-0" for="status-active">Active</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" :class="{ 'is-invalid': formPackage.is_active.error }" type="radio" name="is_active" id="status-inactive" v-model="formPackage.is_active.model" :value="false" />
                        <label class="form-check-label mb-0 pb-0" for="status-inactive">Non-Active</label>
                    </div>
                    <div class="invalid-feedback">{{ formPackage.is_active.error }}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-10 offset-md-2">
                    <button @click="savePackage" class="btn btn-primary" type="button">
                        Save Package
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'

const currentRoute = useRoute()

const formPackage = reactive({
    name: { model: '', error: '' },
    description: { model: '', error: '' },
    starting_price: { model: '', error: '' },
    number_of_users: { model: '', error: '' },
    free_trial_days: { model: '', error: '' },
    free_trial_option: { model:'' },
    is_active: { model: true, error: '' },
})

onMounted(() => {
    getPackageDetails()
})

async function getPackageDetails() {
    await window.axios.get(apiRoute({ name:'api:package.details', params: { item: currentRoute.params.item } }))
        .then(function(response) {
            formPackage.name.model = response.data.data.name
            formPackage.description.model = response.data.data.description
            formPackage.starting_price.model = response.data.data.starting_price
            formPackage.number_of_users.model = response.data.data.number_of_users
            formPackage.free_trial_days.model = response.data.data.free_trial_days
            formPackage.free_trial_option.model = response.data.data.free_trial_days !== null ? true : false
            formPackage.is_active.model = response.data.data.is_active
        })
}

async function savePackage() {
    await window.axios.post(apiRoute({ name: 'api:package.update', params: { item: currentRoute.params.item } }), {
        name: formPackage.name.model,
        description: formPackage.description.model,
        starting_price: formPackage.starting_price.model,
        number_of_users: formPackage.number_of_users.model,
        free_trial_days: formPackage.free_trial_option.model === true ? formPackage.free_trial_days.model : null,
        is_active: formPackage.is_active.model,
    })
    .then(function(response) {
        if (response.data.status == true) {
            formPackage.name.error = ''
            formPackage.description.error = ''
            formPackage.starting_price.error = ''
            formPackage.number_of_users.error = ''
            formPackage.free_trial_days.error = ''
            formPackage.is_active.error = ''

            snackbar(response.data.message)
        } else {
            formPackage.name.error = response.data.error.name != undefined ? response.data.error.name[0] : ''
            formPackage.description.error = response.data.error.description != undefined ? response.data.error.description[0] : ''
            formPackage.starting_price.error = response.data.error.starting_price != undefined ? response.data.error.starting_price[0] : ''
            formPackage.number_of_users.error = response.data.error.number_of_users != undefined ? response.data.error.number_of_users[0] : ''
            formPackage.free_trial_days.error = response.data.error.free_trial_days != undefined ? response.data.error.free_trial_days[0] : ''
            formPackage.is_active.error = response.data.error.is_active != undefined ? response.data.error.is_active[0] : ''
        }
    })
    .catch(function(error) {
        snackbar('Unexpected Error: Unable to update package.')
    })
}
</script>
