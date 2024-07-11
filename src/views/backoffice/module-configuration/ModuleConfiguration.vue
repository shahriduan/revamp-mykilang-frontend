<template>
    <x-content-header 
        :title="$route.params.action == 'create' ? 'New Module' : 'Edit Module'" 
        :breadcrumbs="[{ route: { name: 'console:system_module.index' }, name: 'Modules'}, { name: $route.params.action == 'create' ? 'New Module' : 'Edit Module' }]"
        :previous-route="{ name: 'console:system_module.index' }"
    />
    <CircleSpinner class="mt-4" v-if="contentLoader == true" />
    <div class="card mt-4" v-if="contentLoader == false">
        <div class="card-body">
            <div class="mb-2">
                <label class="col-form-label" for="module_code">Module Code <x-asterisk /></label>
                <input class="form-control w-md-50" id="module_code" v-model="form.module_code.model" type="text" />
            </div>
            <div class="mb-2">
                <label class="col-form-label" for="module_name">Module Name <x-asterisk /></label>
                <input class="form-control w-md-50" id="module_name" v-model="form.module_name.model" type="text" />
            </div>
            <div class="mb-2">
                <label class="col-form-label" for="description">Description <x-asterisk /></label>
                <textarea class="form-control resize-none" id="description" v-model="form.description.model" rows="3"></textarea>
            </div>
            <div class="mb-2">
                <label class="col-form-label" for="domain">Domain</label>
                <input class="form-control w-md-50" id="domain" type="text" v-model="form.domain.model" placeholder="https://visi.com.my" />
            </div>
            <div class="mb-2">
                <label class="col-form-label" for="ipaddress">IP Address</label>
                <input class="form-control w-md-50" id="ipaddress" type="text" v-model="form.ip_address.model" placeholder="127.0.0.1" />
            </div>
            <div class="mb-2">
                <label class="col-form-label" for="main_landing_url">Main Landing URL</label>
                <input class="form-control w-md-50" id="main_landing_url" type="text" v-model="form.main_landing_url.model" placeholder="/home" />
            </div>
            <div class="mb-2">
                <label class="col-form-label pb-0" for="main_landing_url">Platform Access</label>
                <div class="small">Settings for this module in which platform it can be accessed.</div>
                <div class="form-check mb-0 mt-1">
                    <input class="form-check-input" id="web_app" type="checkbox" v-model="form.web_app_access.model" />
                    <label class="form-check-label" for="web_app">Web App</label>
                </div>
                <div class="form-check mb-0">
                    <input class="form-check-input" id="desktop_app" type="checkbox" v-model="form.desktop_app_access.model" />
                    <label class="form-check-label" for="desktop_app">Desktop App</label>
                </div>
            </div>
            <div class="my-3"></div>
            <button class="btn btn-primary" type="button" @click="saveModule" :disabled="buttonLoader == true">
                {{ buttonSubmitText }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'

const currentRoute = useRoute()
const contentLoader = ref(true)
const buttonLoader = ref(false)
const buttonSubmitText = ref('Save Changes')

const form = reactive({
    module_code: { model: '', error: '' },
    module_name: { model: '', error: '' },
    description: { model: '', error: '' },
    domain: { model: '', error: '' },
    ip_address: { model: '', error: '' },
    main_landing_url: { model: '', error: '' },
    web_app_access: { model: false },
    desktop_app_access: { model: false }
})

onMounted(() => {
    getModuleDetails()
})

async function getModuleDetails() {
    await window.axios.get(apiRoute({ name: 'api:platform_module.module_details', params: { module: currentRoute.params.module } }))
        .then(function(response) {
            form.module_code.model = response.data.data.code
            form.module_name.model = response.data.data.module_name
            form.description.model = response.data.data.description
            form.domain.model = response.data.data.domain
            form.ip_address.model = response.data.data.ip_address
            form.main_landing_url.model = response.data.data.main_landing_url,
            form.web_app_access.model = response.data.data.web_app_access,
            form.desktop_app_access.model = response.data.data.desktop_app_access
        })

    contentLoader.value = false
}

async function saveModule() {
    buttonLoader.value = true
    buttonSubmitText.value = 'Saving ...'

    await window.axios.post(apiRoute({ name: 'api:platform_module.update_module', params: { module: currentRoute.params.module } }), {
            module_code: form.module_code.model,
            module_name: form.module_name.model,
            description: form.description.model,
            domain: form.domain.model,
            ip_address: form.ip_address.model,
            main_landing_url: form.main_landing_url.model,
            web_app_access: form.web_app_access.model,
            desktop_app_access: form.desktop_app_access.model
        })
        .then(function(response) {
            snackbar(response.data.message)
        })
        .catch(function(error) {
            snackbar('Unexpected Error: Unable to update module.')
        })
    
    buttonLoader.value = false    
    buttonSubmitText.value = 'Save Changes'
}
</script>