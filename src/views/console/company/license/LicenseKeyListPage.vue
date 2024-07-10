<template>
    <x-content-header v-if="authStore.userProfile.user_type == ConstantConfig.userType.client"
        title="Licenses"
    />

    <x-content-header v-if="authStore.userProfile.user_type == ConstantConfig.userType.hq"
        title="Licenses"
        :breadcrumbs="[{ route: { name: 'client_account.index'}, name: 'Client Account List' }, { name: $route.query.name + ' Licenses' }]"
        :previous-route="{ name: 'client_account.index' }"
    />

    <LicenseKeyListPlaceholder v-if="contentLoader == true" />

    <div v-if="contentLoader == false">
        <div class="card my-3" :key="index" v-for="(license, index) in licenses">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h4 class="fw-bold d-inline me-3">{{ license.label_name }}</h4>
                        <span class="badge rounded-pill badge-subtle-success" v-if="license.device_id">Paired</span>
                    </div>
                    <div class="col-md-6 text-md-end d-none d-md-block">
                        <EditAndDownloadLicenseButton
                            :license-id="license.id"
                            :license-key="license.license_key"
                            :license-filename="license.filename"
                            :license-device-id="license.device_id"
                        />
                    </div>
                </div>
                <!-- <div class="row mt-2">
                    <div class="col-md-2 fw-bold">Start :</div>
                    <div class="col-md-10">{{ license.start_date }}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-2 fw-bold">End :</div>
                    <div class="col-md-10">{{ license.end_date }}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-2 fw-bold">Duration :</div>
                    <div class="col-md-10">{{ license.duration }} day(s) <i class="fas fa-arrow-right mx-2"></i> {{ license.expired_in_text }}</div>
                </div> -->
                <div class="row mt-3">
                    <div class="col-md-2 fw-bold">License Key :</div>
                    <div class="col-md-10">
                        {{ license.license_key }} <br>
                        <span @click="copyLicenseKey(license.id, license.license_key)" style="cursor: pointer;">
                            <i class="fa-copy me-1" :class="[copyId[license.id].icon]"></i>
                            <span>{{ copyId[license.id].text }}</span>
                        </span>
                    </div>
                </div>
                <div class="row mt-2" v-if="license.factory_name">
                    <div class="col-md-2 fw-bold">For Factory :</div>
                    <div class="col-md-10">{{ license.factory_name }}</div>
                </div>
                <div class="row mt-2" v-if="license.device_id">
                    <div class="col-md-2 fw-bold">Device ID :</div>
                    <div class="col-md-10">{{ license.device_id }}</div>
                </div>
                <div class="row mt-2" v-if="license.device_pair_date">
                    <div class="col-md-2 fw-bold">Paired Date :</div>
                    <div class="col-md-10">{{ license.device_pair_date }}</div>
                </div>
                <div class="row mt-3 d-md-none">
                    <div class="col-12">
                        <EditAndDownloadLicenseButton
                            :license-id="license.id"
                            :license-key="license.license_key"
                            :license-filename="license.filename"
                            :license-device-id="license.device_id"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="card mt-3">
            <div class="card-body text-center cursor-pointer" @click="createNewLicenseKey" v-if="$can('license_key.add')">
                <i class="fa-regular fa-square-plus fa-2x me-3"></i>
                <h2 class="fw-bold d-inline">New License Key</h2>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import EditAndDownloadLicenseButton from '@/views/console/company/license/EditAndDownloadLicenseButton.vue'
import LicenseKeyListPlaceholder from '@/views/console/company/license/LicenseKeyListPlaceholder.vue'
import apiRoute from '@/helpers/ApiHelper'
import dayjs from 'dayjs'
import ConstantConfig from '@/config/ConstantConfig'

const authStore = useAuthStore()
const { copy } = useClipboard()
const currentRoute = useRoute()
const router = useRouter()

const contentLoader = ref(true)

const licenses = ref([])
const copyId = ref([])

onMounted(async () => {
    await getCompanyLicenses()
    contentLoader.value = false
})

function copyLicenseKey(license_id, license_key) {
    copyId.value[license_id].text = 'Copied'
    copyId.value[license_id].icon = 'fa-solid'

    copy(license_key);

    setTimeout(() => {
        copyId.value[license_id].text = 'Copy'
        copyId.value[license_id].icon = 'fa-regular'
    }, 1500)
}

function createNewLicenseKey() {
    router.push({ name: 'client_account.license_key.form', params: { company: currentRoute.params.company, action: 'create'  }, query: { name: currentRoute.query.name } })
}

async function getCompanyLicenses() {
    await window.axios.get(apiRoute({ name: 'api:company.license_list', params: { company: currentRoute.params.company } }))
        .then(function(response) {
            licenses.value = response.data.data.map((value, key) => {
                copyId.value[value.id] = { 'text': 'Copy', 'icon': 'fa-regular' } // Set copy ID for each license key

                var combinename = value.company_name + ' license key ' + parseInt(key  + 1)
                value['filename'] = combinename.replaceAll(' ', '_').toLowerCase() // Set license key filename
                value['start_date'] = dayjs(value.start_date, 'YYYY-MM-DD').format('DD MMM YYYY')
                value['end_date'] = dayjs(value.end_date, 'YYYY-MM-DD').format('DD MMM YYYY')
                value['device_pair_date'] = value.device_pair_date != null ? dayjs(value.device_pair_date, 'YYYY-MM-DD').format('DD MMM YYYY') : null
                return value
            })
        })
}
</script>
