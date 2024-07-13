<template>
    <h4 class="fw-bold">Forgot Password</h4>
    <div class="row text-start mt-3">
        <div class="col-12">
            <input type="text" class="form-control form-control-lg" id="text" :class="{ 'is-invalid': email.error }" v-model="email.model" placeholder="Email" />
            <div class="invalid-feedback">{{ email.error }}</div>
        </div>
        <div class="col-12">
            <div class="text-center mt-3">
                <div class="d-grid gap-2">
                    <button type="button" class="btn btn-primary" @click="submit" :disabled="loader">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-show="loader"></span>
                        Reset Password
                    </button>
                </div>
                <div class="mb-2"></div>
                <router-link :to="{ 'name': 'login' }">
                    Back to login 
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'

const email = reactive({ model: '', error: '' })
const loader = ref(false)

async function submit() {
    if (email.model == '') {
        email.error = 'The email field is required.'    
    } else {
        loader.value = true

        await window.axios.post(apiRoute({ name: 'api:forgot_password' }), {
            email: email.model
        })
        .then(function(response) {
            if (response.data.status == true) {
                email.error = email.model = ''
                snackbar(response.data.message)
            } else {
                if (response.data.error.email != undefined) {
                    email.error = response.data.error.email[0]            
                }
            }
        })
        .catch(function(error) {
            snackbar('Unexpected Error. Please try again later.')
        })

        loader.value = false
    }
}
</script>