<template>
    <x-content-header title="My Company" class="mb-3"/>

    <div class="card mt-4">
        <div class="card-body">
            <div class="d-flex flex-column flex-md-row">
                <div class="d-flex flex-column text-center">
                    <img :src="form.logo.model != null ? form.logo.model : '/img/illustrations/company.png'" alt="Image" class="company-image mx-auto border rounded-3" />
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-link link-secondary text-nowrap" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Change Logo
                    </button>
                </div>
                <!-- Modal -->
                <div class="modal fade" id="staticBackdrop" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" v-on:hidden="handleModalClosed" ref="modalRef">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">Change Logo</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">
                                        Upload Image
                                        <ul class="mt-1">
                                            <li> Square image sizes are preferred</li>
                                            <li>5MB max</li>
                                            <li>.png, .jpg, .jpeg only</li>
                                        </ul>
                                    </label>
                                    <input class="form-control" :class="{ 'is-invalid': form.logo.error != '' ? true : false }"  type="file" name="logo" id="formFile" ref="fileInput" @change="previewImage">
                                    <!-- <div class="invalid-feedback">{{ form.logo.error }}</div> -->
                                    <div v-if="form.logo.error.length > 0">
                                        <ul class="mt-1">
                                            <li :key="index" v-for="(error, index) in form.logo.error" class="text-danger"><small>{{ error }}</small></li>
                                        </ul>
                                    </div>
                                    <div v-if="imagePreview" class="mt-3">
                                        <label for="imagePreview">Preview:</label>
                                        <br/>
                                        <img :src="imagePreview" id="imagePreview" alt="Image Preview" class="company-image mx-auto border rounded-3">
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-link link-danger" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" @click="uploadLogo" :disabled="submitLoader">
                                    <span class="spinner-border spinner-border-sm me-1" v-show="submitLoader"></span>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ms-4 mt-2 mt-md-0" :class="{ 'placeholder-wave': loader }">
                    <div class="d-flex flex-row justify-content-between mb-2">
                        <h4 class="fw-bold" :class="{ 'placeholder col-6': loader}">{{ companies.name }}</h4>
                        <router-link :to="{ name: 'console:client_account.form', params: { action: 'edit', company: companyId } }" class="btn btn-outline-dark" v-if="$can('client_account.edit')">
                            <i class="fa-solid fa-pencil me-1"></i> Edit
                        </router-link>
                    </div>
                    <div class="d-flex flex-column flex-xl-row mb-3" :class="{ 'placeholder col-12': loader}">
                        <div class="pe-5">
                            <i class="bi bi-envelope me-2"></i> {{ companies.email }}
                        </div>
                        <div class="pe-5">
                            <i class="bi bi-telephone me-2"></i> {{ companies.telephone }}
                        </div>
                        <div class="pe-5">
                            <i class="bi bi-geo-alt me-2"></i> {{ companies.city }}, {{ companies.state_name }}
                        </div>
                    </div>
                    <p :class="{ 'placeholder col-12': loader }" class="text-justify">
                        {{ companies.company_information }}
                    </p>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="row border-top text-center pt-3" :class="{ 'placeholder-wave': loader }">
                <div class="col-sm-4 col-md-5">
                    <div class="d-flex justify-content-md-center align-items-center">
                        <div>
                            <i class="fa-solid fa-user-group fa-2x"></i>
                        </div>
                        <div>
                            <div class="d-flex flex-column text-start ps-4">
                                <div>USERS</div>
                                <div :class="{ 'placeholder col-12': loader }">{{ companies.total_users }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-8 col-md-7">
                    <div class="d-flex justify-content-md-center align-items-center">
                        <div>
                            <i class="fa-solid fa-chart-pie fa-2x"></i>
                        </div>
                        <div>
                            <div class="d-flex flex-column text-start ps-4">
                                <div>SECTOR</div>
                                <div :class="{ 'placeholder col-12': loader }">{{ companies.sector }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Circlespinner class="mt-5" v-if="loader == true" />

    <div class="row mt-1 gy-3 mb-1" v-if="loader == false">
        <div class="col-sm-6 col-xl-6" v-for="subsidiary in subsidiaries" :key="subsidiary.id">
            <router-link :to="{ name: 'console:subsidiary.form', params: { action: 'edit', subsidiary: subsidiary.id  } }" style="text-decoration: none;">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3">
                                <img src="/img/illustrations/location-pin.png" class="img-fluid rounded float-left" alt="subsidiary" width="80">
                            </div>
                            <div class="col-9">
                                <h4 class="d-flex align-items-center h-100">{{ subsidiary.subsidiary_name }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="col-sm-6 col-xl-6" v-if="$can('company.manage_subsidiary')">
            <router-link :to="{ name: 'console:subsidiary.form', params: { action: 'create' } }" style="text-decoration: none;">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="row h-100">
                            <h4 class="d-flex align-items-center h-100 justify-content-center"><i class="bi bi-plus-square me-2"></i> Add New Subsidiary</h4>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { snackbar } from '@/components/Snackbar'
import Circlespinner from '@/components/CircleSpinner.vue'
import apiRoute from '@/helpers/ApiHelper'

const authStore = useAuthStore()

const subsidiaries = ref([])
const companies = ref([])
const fileInput = ref()
const imagePreview = ref()
const modalRef = ref(null)

const loader = ref(true)
const submitLoader = ref(false)
const responseStatus = ref(false)

const form = reactive({
    logo: { model: null, error: [] },
})

onMounted(async () => {
    await getClientAccountDetails()
    await getSubsidiaries()
    loader.value = false
    modalRef.value.addEventListener('imageUploaded', handleCloseModal);
    modalRef.value.addEventListener('hidden.bs.modal', handleModalClosed);
})

async function getClientAccountDetails() {
    await window.axios.get(apiRoute({ name : 'api:client_account.account_details', params: { company: authStore.userProfile.company_id} }))
        .then(function(response) {
            companies.value = response.data.data
            form.logo.model = response.data.data.logo != '' ? response.data.data.logo : null
        })
}

async function getSubsidiaries() {
    await window.axios.get(apiRoute({ name: 'api:subsidiary.list'}))
        .then(function(response) {
            subsidiaries.value = response.data.data
        })
}

async function uploadLogo() {
    submitLoader.value = true

    const formData = new FormData();
    formData.append('logo', fileInput.value.files[0]);

    try {
        const response = await window.axios.post(apiRoute({ name: 'api:client_account.upload_logo' }), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (response.data.status == true) {
            form.logo.model = ''
            responseStatus.value = true

            clearValues()
            snackbar(response.data.message)
            getClientAccountDetails()
            modalRef.value.dispatchEvent(new Event('imageUploaded'));

        } else {
            form.logo.error = response.data.error.logo != undefined ? response.data.error.logo : ''
        }
    } catch (error) {
        snackbar('Unexpected Error: ' + error)
    }

    submitLoader.value = false
}

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            // Display an error message or handle the case where the file is not an image
            imagePreview.value = ''
            form.logo.error = ['Selected file is not an image.']
            return
        }

        form.logo.error = ''
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function clearValues() {
    form.logo.error = []
    imagePreview.value = ''
    fileInput.value.value = ''
}

const handleCloseModal = () => {
    modalRef.value.classList.remove('show');
    modalRef.value.setAttribute('aria-hidden', 'true');
    modalRef.value.style.display = 'none';
    const modalBackdrop = document.querySelector('.modal-backdrop');
    modalBackdrop.parentNode.removeChild(modalBackdrop);
}

const handleModalClosed = () => {
    clearValues();
}
</script>

<style lang="css" scoped>
.img-area {
    height: 125px;
    width: 100px;
}
.company-image {
    background-size: cover;
    background-position: center center;
    height: 125px;
    width: 125px;
}
</style>
