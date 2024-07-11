<template>
    <x-content-header v-if="authStore.userProfile.user_type == ConstantConfig.userType.client"
        title="Unpair Lincense Key"
        :breadcrumbs="[
            { route: { name: 'console:license_key.index' }, name: 'License Key' },
            { name: companyName + ' Licenses' },
            { name: 'Unpair ' + labelName },
        ]"
        :previous-route="{ name: 'console:license_key.index' }"
    />

    <x-content-header v-if="authStore.userProfile.user_type == ConstantConfig.userType.hq"
        title="Unpair Lincese Key"
        :breadcrumbs="[
            { route: { name: 'console:client_account.index' }, name: 'Client Accounts' },
            { route: { name: 'console:client_account.license_key.index', params: { company: $route.params.company }, query: { name: $route.query.name } }, name: $route.query.name + ' Licenses' },
            { name: 'Unpair ' + labelName },
        ]"
        :previous-route="{ name: 'console:client_account.license_key.index', params: { company: $route.params.company }, query: { name: $route.query.name } }"
    />

    <div class="card mt-3">
        <div class="card-body">
            <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle-fill"></i>
                Unexpected bad things will happen if you don't read this!
            </div>
            <p>
                This will unpair the license key from the <span class="fw-bold">Device ID: {{ deviceId }}</span> for the <span class="fw-bold">{{ factoryName }}</span> factory, and this action can't be undone! <br>
                <span class="text-danger fw-bold">LINX will no longer able to synchronize to the cloud. That means your factory data will not be available in the cloud.</span>
            </p>
            <button type="button" class="btn btn-secondary" @click="enabledInputPassword">
                I have read and understand these effects
            </button>
            <div class="mt-4" v-if="enableInput">
                <hr>
                <div class="mb-3">
                    <label for="password" class="form-label">To confirm, enter the password for {{ email }} in the input box below:</label>
                    <input type="text" class="form-control w-100 w-md-50" :class="{ 'is-invalid': form.password.error }" id="password" placeholder="Password" v-model="form.password.model">
                    <div class="invalid-feedback">{{ form.password.error }}</div>
                </div>
                <button class="btn btn-primary" @click="unpairLicenseKey">Unpair Key</button>
                <button type="button" class="btn btn-link link-danger" @click="disabledInputPassword">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'
import ConstantConfig from '@/config/ConstantConfig'

const authStore = useAuthStore()
const currentRoute = useRoute()
const router = useRouter()

const email = ref('')
const labelName = ref('')
const companyName = ref('')
const factoryName = ref('')
const deviceId = ref('')
const deviceToken = ref('')
const loader = ref(false)
const enableInput = ref(false)

const form = reactive({
    password: { model: '', error: '' }
})

onMounted(async() => {
    await getUserProfile()
    await getLicenseDetails()
})

async function getUserProfile() {
    await window.axios.get(apiRoute({ name: 'api:user_profile' }))
        .then(function(response) {
            email.value = response.data.data.email
        })
}

async function getLicenseDetails() {
    await window.axios.get(apiRoute({ name: 'api:company.license_details', params: { license: currentRoute.params.license } }))
        .then(function(response) {
            labelName.value = response.data.data.label_name
            companyName.value = response.data.data.company_name
            factoryName.value = response.data.data.factory_name
            deviceId.value = response.data.data.device_id
            deviceToken.value = response.data.data.device_token
        })
}

async function enabledInputPassword() {
    enableInput.value = true
}

async function disabledInputPassword() {
    enableInput.value = false
    form.password.model = form.password.error = ''
}

async function unpairLicenseKey() {
    loader.value = true

    await window.axios.post(apiRoute({ name: 'api:company.unpair_submit_license' }), {
        password: form.password.model,
        device_id: deviceId.value,
        device_token: deviceToken.value
    })
    .then(function(response) {
        if (response.data.status == true) {
            snackbar('License key unpair successfully.')
            router.push({ name: 'console:license_key.index' })
        } else {
            if (form.password.error) {
                snackbar(response.data.message)
            }
            form.password.error = response.data.error.password != undefined ? response.data.error.password[0] : ''
        }
    })
    .catch(function(error) {
        snackbar('Unexpected Error.')
    })

    loader.value = false
}
</script>
