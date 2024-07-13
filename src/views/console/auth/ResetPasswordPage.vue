<template>
    <h4 class="fw-bold">Reset Password</h4>
    <div class="row g-1 text-start">
        <div class="col-12">
            <label class="form-label" for="new_password">New Password</label>
            <input type="password" class="form-control form-control-lg" id="new_password" :class="{ 'is-invalid': new_password.error }" v-model="new_password.model" />
            <div class="invalid-feedback">{{ new_password.error }}</div>
        </div>
        <div class="col-12">
            <label class="form-label" for="new_password">New Password Confirmation</label>
            <input type="password" id="new_password_confirmation" class="form-control form-control-lg" :class="{ 'is-invalid': new_password_confirmation.error }" v-model="new_password_confirmation.model" />
            <div class="invalid-feedback">{{ new_password_confirmation.error }}</div>
        </div>
        <div class="col-12">
            <div class="text-center mt-3 d-grid gap-2">
                <button type="button" class="btn btn-primary" @click="submit" :disabled="loader">
                    <div class="spinner-border spinner-border-sm me-1" v-show="loader == true">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    Reset Password
                </button>
            </div>
        </div>
    </div>

    <div class="modal animate__animated animate__zoomIn animate__faster" id="redirectmodal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-info modal-dialog-centered" role="document">
            <div class="modal-content text-center">
                <div class="modal-body">
                    <p><i class="fas fa-check-circle text-success me-2"></i>Password was successfully updated.</p>
                    <p class="mb-0">Redirecting to login page ...</p>
                    <div class="spinner-grow spinner-grow-sm" role="status" v-for="n in 3">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>

<script setup>
import { reactive, ref } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useRouter, useRoute } from 'vue-router'
import apiRoute from '@/helpers/ApiHelper'
import 'animate.css'

const currentRoute = useRoute()
const router = useRouter()

const new_password = reactive({ model: '', error: '' })
const new_password_confirmation = reactive({ model: '', error: '' })
const loader = ref(false)
const token = ref(currentRoute.params.token)
const email = ref(currentRoute.query.email)

// TODO|Low: beforemount check token validity

async function submit() {
    loader.value = true

    await window.axios.post(apiRoute({ name: 'api:reset_password' }), {
        token: token.value,
        email: email.value,
        new_password: new_password.model,
        new_password_confirmation: new_password_confirmation.model
    })
    .then(function(response) {
        if (response.data.status == true) {
            new_password.model = new_password.error = new_password_confirmation.model = new_password_confirmation.error = ''

            setTimeout(() => {
                const myModal = new bootstrap.Modal(document.getElementById('redirectmodal'))
                myModal.show()

                setTimeout(() => {
                    myModal.hide()

                    setTimeout(() => {
                        router.push({ name: 'login' })
                    }, 500)
                }, 1200)
            }, 500)
        } else {
            if (response.data.error.new_password != undefined) {
                new_password.error = response.data.error.new_password[0]            
            }

            if (response.data.error.new_password_confirmation != undefined) {
                new_password_confirmation.error = response.data.error.new_password_confirmation[0]            
            }

            if (response.data.error.token != undefined || response.data.error.email != undefined) {
                snackbar('Unexpected Error: Invalid link')           
            }

            if (response.data.error.reset != undefined) {
                snackbar(response.data.error.reset)           
            }
        }
    })
    .catch(function(error) {
        snackbar('Unexpected Error: Unable to reset password.')
    })

    loader.value = false
}
</script>