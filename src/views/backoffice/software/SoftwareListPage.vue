<template>
    <x-content-header
        :title="$route.params.versionId ? 'Update Version' : 'New Version'"
        class="mb-3"
        :breadcrumbs="[
            { route: { name: 'console:software.index'}, name: 'Softwares' },
            { name: $route.query.name },
        ]"
        :previous-route="{ name: 'console:software.index' }"
    />

    <div class="card">
        <div class="card-body">
            <div class="mb-3">
                <label class="form-label" for="version">Version <x-asterisk /></label>
                <input class="form-control w-md-50" :class="{ 'is-invalid': form.version.error }" id="version" v-model="form.version.model" type="text" placeholder="1.0.0" />
                <div class="invalid-feedback">{{ form.version.error }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label" for="description">Description</label>
                <textarea class="form-control" id="description" rows="10" v-model="form.description.model" placeholder="What's Changed" style="resize: none"></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label" for="software-file">Software File <x-asterisk /></label>
                <input class="form-control" :class="{ 'is-invalid': form.softwareFile.error }" @change="handleSoftwareFileChange" id="software-file" type="file" />
                <div class="invalid-feedback">{{ form.softwareFile.error }}</div>
                <a class="icon-link mt-1" :href="softwareVersion?.file_url" v-if="$route.params.versionId" target="_blank">
                    Download existing software version
                    <span class="fas fa-download"></span>
                </a>
            </div>
            <div class="mb-1">
                <label class="form-label" for="user-manual">User Manual <x-asterisk /></label>
                <div class="d-flex">
                    <div class="form-check mb-0 me-3">
                        <input class="form-check-input" type="radio" name="userManulOption1" id="userManulOption1" v-model="form.userManualOption.model" :value="true" />
                        <label class="form-check-label" for="userManulOption1">
                            Add new user manual
                        </label>
                    </div>
                    <div class="form-check mb-0">
                        <input class="form-check-input" type="radio" name="userManulOption2" id="userManulOption2" v-model="form.userManualOption.model" :value="false" @change="loadUserManuals" />
                        <label class="form-check-label" for="userManulOption2">
                            Choose uploaded user manual
                        </label>
                    </div>
                </div>
            </div>
            <div class="mb-4">
                <div v-if="form.userManualOption.model === true">
                    <input class="form-control" :class="{ 'is-invalid': form.userManualFile.error }" @change="handleUserManualFileChange" id="user-manual" type="file" />
                    <div class="invalid-feedback">{{ form.userManualFile.error }}</div>
                </div>
                <div v-if="form.userManualOption.model === false">
                    <select class="form-select" :class="{ 'is-invalid': form.previouSoftwareVersionId.error }" aria-label="select-user-manual" id="user-manual" v-model="form.previouSoftwareVersionId.model">
                        <option value="" selected>Select user manual</option>
                        <option v-for="manual in softwareList" :key="manual.id" :value="manual.id">{{ manual.software_name }} (v{{ manual.version }})</option>
                    </select>
                    <div class="invalid-feedback">{{ form.previouSoftwareVersionId.error }}</div>
                </div>
                <a class="icon-link mt-1" :href="softwareVersion?.user_manual_url" v-if="$route.params.versionId" target="_blank">
                    Download existing user manual
                    <span class="fas fa-download"></span>
                </a>
            </div>
            <div class="form-check">
                <input class="form-check-input" :class="{ 'is-invalid': form.markAsLatest.error }" id="mark-as-latest" type="checkbox" v-model="form.markAsLatest.model" :true-value="true" :false-value="false" />
                <label class="form-check-label mb-0" for="mark-as-latest">Set as the latest release</label>
                <div></div>
                <small>This release will be labeled as the latest version for this software.</small>
                <div class="invalid-feedback">{{ form.markAsLatest.error }}</div>
            </div>
            <hr>
            <button class="btn btn-primary me-1 mb-1" type="button" :disabled="submitLoader" @click="submitSoftwareVersion()">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="submitLoader"></span>
                <span v-if="submitLoader == false">Publish Release</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'

const route = useRoute()

const softwareVersion = ref(null)
const softwareList = ref({})

const form = reactive({
    version: { model: '', error: '' },
    description: { model: '', error: '' },
    softwareFile: { model: null, error: '' },
    userManualFile: { model: null, error: '' },
    previouSoftwareVersionId: { model: null, error: '' },
    markAsLatest: { model: false },
    userManualOption: { model: true }
})

const submitLoader = ref(false)

onMounted(async () => {
    if (route.params.versionId) {
        await getSoftwareVersionDetails()
    }
})

async function getSoftwareVersionDetails() {
    await window.axios.get(apiRoute({ name: 'api:software.version_details', params: { softwareVersionId: route.params.versionId } }))
        .then(response => {
            softwareVersion.value = response.data.data
            form.version.model = response.data.data.version
            form.description.model = response.data.data.description
            form.markAsLatest.model = response.data.data.is_latest
        })
}

async function getSoftwareList() {
    try {
        const response = await window.axios.get(apiRoute({ name: 'api:software.list' }))

        const filteredData = response.data.data.filter(x => x.id === parseInt(route.params.softwareId))

        const data = filteredData.map(x =>
            x.available_version.map(y => ({
                id: y.id,
                version: y.version,
                software_name: y.software_name
            }))
        ).flat()

        softwareList.value = data

    } catch (error) {
        snackbar('Unexpected Error: Error while fetching software user manual list.')
    }
}

function loadUserManuals() {
    if (form.userManualOption.model === false) {
        form.previouSoftwareVersionId.model = ''
        getSoftwareList()
    }
}

function handleSoftwareFileChange(event) {
    form.softwareFile.model = event.target.files[0]
}

function handleUserManualFileChange(event) {
    if (form.userManualOption.model === true) {
        form.userManualFile.model = event.target.files[0]
    }
}

async function submitSoftwareVersion() {
    submitLoader.value = true

    var parameter = route.params.versionId
        ? { softwareId: route.params.softwareId, softwareVersionId: route.params.versionId, action: 'edit' }
        : { softwareId: route.params.softwareId, action: 'create' }

    let formData = new FormData()

    formData.append('version', form.version.model)
    formData.append('description', form.description.model || '')
    formData.append('is_latest', form.markAsLatest.model == true ? 1 : 0)

    if (form.softwareFile.model) {
        formData.append('software_file', form.softwareFile.model)
    }

    if (form.userManualFile.model) {
        formData.append('user_manual_file', form.userManualFile.model)
    }

    if (form.previouSoftwareVersionId.model) {
        formData.append('previous_manual_id', form.previouSoftwareVersionId.model)
    }

    await window.axios.post(apiRoute({ name: 'api:software.submit_version', params: parameter }),
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.data.status == true) {
                snackbar(response.data.message)

                // After user create new version, clear input
                if (! route.params.versionId) {
                    form.version.model = form.softwareFile.model = form.description.model = form.previouSoftwareVersionId.model = form.userManualFile.model = ''
                    document.getElementById('software-file').value = ''
                    document.getElementById('user-manual').value = ''
                    form.markAsLatest.model = false
                }

                form.version.error = form.markAsLatest.error = form.softwareFile.error = ''

            } else {
                form.version.error = response.data.error.version?.[0] ?? ''
                form.softwareFile.error = response.data.error.software_file?.[0] ?? ''
                form.userManualFile.error = response.data.error.user_manual_file?.[0] ?? ''
                form.previouSoftwareVersionId.error = response.data.error.previous_manual_id?.[0] ?? ''
                form.markAsLatest.error = response.data.error.is_latest?.[0] ?? ''
            }
        })
        .catch(error => {
            snackbar('Unexpected Error: Failed to submit version.')
        })

    submitLoader.value = false
}
</script>
