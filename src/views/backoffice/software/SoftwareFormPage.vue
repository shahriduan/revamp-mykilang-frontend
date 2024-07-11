<template>
    <x-content-header title="Softwares" class="mb-3" />

    <div class="row g-3">
        <div class="col-md-6 col-xxl-4" v-for="n in 2" v-if="loader">
            <SoftwareListPlaceholder />
        </div>
        <div class="col-md-6 col-xxl-4" v-if="loader == false" v-for="software in softwares">
            <div class="d-flex align-items-center px-4 py-x1 bg-body-tertiary rounded-3 border position-relative h-100">
                <div class="icon-item icon-item-xl shadow-none mx-2 bg-info-subtle">
                    <span class="fa-solid fa-desktop"></span>
                </div>
                <div class="ms-3 my-x1">
                    <h5 class="fs-0 fw-semi-bold mb-2">
                        <a class="text-900 hover-primary stretched-link" href="javascript:;" @click="showOffCanvas(software)">
                            {{ software.long_name }}
                        </a>
                    </h5>
                    <h6 class="mb-0 text-600">{{ software.description }}</h6>
                </div>
            </div>
        </div>
    </div>

    <div class="offcanvas offcanvas-end" id="list-software-version" tabindex="-1" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">{{ offCanvasData?.long_name }} Version</h5>
            <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="d-flex flex-column">
                <div class="d-flex justify-content-center">
                    <button class="btn btn-outline-primary rounded-pill" type="button" @click="router.push({ name: 'console:software.form', params: { softwareId: offCanvasData.id }, query: { name: offCanvasData?.long_name } })" data-bs-dismiss="offcanvas">
                        <span class="fas fa-plus me-1"></span> New Version
                    </button>
                </div>
                <ul class="list-group list-group-flush mt-3" v-if="offCanvasData?.available_version.length > 0">
                    <a 
                        href="javascript:;" 
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                        data-bs-dismiss="offcanvas"
                        @click="router.push({ name: 'console:software.form', params: { softwareId: offCanvasData?.id, versionId: version.id }, query: { name: offCanvasData?.long_name } })" 
                        v-for="version in offCanvasData?.available_version">
                        v{{version.version}}
                        <span class="badge badge-subtle-success rounded-pill" v-if="version.is_latest == true">
                            Latest
                        </span>
                    </a>
                </ul>
                <div class="alert alert-info border-0 text-center mt-3" v-else>
                    <p class="mb-0 flex-1">No available version.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import apiRoute from '@/helpers/ApiHelper'
import SoftwareListPlaceholder from '@/views/backoffice/software/SoftwareListPlaceholder.vue'

const router = useRouter()

let offcanvasInstance

const softwares = ref([])
const offCanvasData = ref(null)

const loader = ref(true)

onMounted(async () => {
    await getListSoftware()
    loader.value = false
    offcanvasInstance = new bootstrap.Offcanvas('#list-software-version')
})

function showOffCanvas(softwareObject) {
    offcanvasInstance.show() 
    offCanvasData.value = softwareObject
}

async function getListSoftware() {
    await window.axios.get(apiRoute({ name: 'api:software.list' }))
        .then(response => softwares.value = response.data.data)
}
</script>