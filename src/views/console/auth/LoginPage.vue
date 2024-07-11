<template>
    <div class="d-grid gap-2">
        <button type="button" class="btn btn-outline-secondary btn-block" @click="googleLogin">
            <i class="fa-brands fa-google me-2"></i> Sign in with Google
        </button>
    </div>

    <h6 class="horizontal-line-header">
        <span class="horizontal-line-text">or login with</span>
    </h6>
                
    <form class="row g-1 text-start" @submit.prevent="authenticate">
        <div class="col-12">
            <label class="form-label" for="username">Email / Username</label>
            <input type="text" class="form-control form-control-lg" id="username" :class="{ 'is-invalid': form.username.isInvalid }" v-model="form.username.model" />
            <div class="invalid-feedback">{{ form.username.error }}</div>
        </div>
        <div class="col-12">
            <label class="form-label" for="password">Password</label>
            <input type="password" class="form-control form-control-lg" id="password" :class="{ 'is-invalid': form.password.isInvalid }" v-model="form.password.model" />
            <div class="invalid-feedback">{{ form.password.error }}</div>
        </div>
        <div class="col-12 mt-3 mb-1">
            <div class="d-flex justify-content-between">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="remember-me" v-model="rememberMe" />
                    <label class="form-check-label" for="remember-me">Stay Sign In</label>
                </div>
                <router-link :to="{ name: 'forgot_password' }">Forgot Password</router-link>
            </div>
        </div>
        <div class="col-12">
            <div class="text-center d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="loader">
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-show="loader"></span>
                    SIGN IN
                </button>
            </div>
        </div>
    </form>
    <!-- <div class="text-center mt-3">
        <a href="">English</a> | 
        <a href="">Bahasa Melayu</a>
    </div> -->
    <div class="modal animate__animated animate__zoomIn" id="socialite-failed" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-info modal-dialog-centered" role="document">
            <div class="modal-content text-center">
                <div class="modal-body">
                    <i class="fas fa-bell fa-3x animate__animated animate__swing mb-4"></i>
                    <p class="">{{ socialiteMsg }}</p>
                </div>
                <div class="modal-footer flex-center">
                    <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>    
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import { useAuthStore } from '@/stores/AuthStore'
import { loadingOverlay } from '@/components/LoadingOverlay'
import apiRoute from '@/helpers/ApiHelper'
import 'animate.css'

const loader = ref(false)
const rememberMe = ref(false)
const socialiteMsg = ref()
const router = useRouter()
const currentRoute = useRoute()

const form = reactive({
    username: { model: '', error: '', isInvalid: false },
    password: { model: '', error: '', isInvalid: false }
})

const user_agent = ref(navigator.userAgent)
const coordinate = ref(null)

const device = computed(() => {
    var agent = navigator.userAgent
    let checkDevice

    if (/Mobile/.test(agent)) {
        checkDevice = 'Mobile'
    } else if (/Tablet/.test(agent)) {
        checkDevice = 'Tablet'
    } else {
        checkDevice = 'Desktop/Laptop'
    }

    return checkDevice
})

onMounted(() => {
    navigator.geolocation.getCurrentPosition((getCoordinate))

    // Show modal socialite login failed
    if (currentRoute.query.soclite == 'failed') {
        socialiteMsg.value = currentRoute.query.soclite_msg

        const myModal = new bootstrap.Modal(document.getElementById('socialite-failed'))
        myModal.show()
    }   
})

function getCoordinate(position) {
    coordinate.value = position.coords.latitude + ',' + position.coords.longitude
}

async function authenticate() {
    loader.value = true
    form.username.isInvalid = false
    form.password.isInvalid = false
    
    if (form.username.model == '' || form.password.model == '') {
        if (form.username.model == '') {
            form.username.isInvalid = true
            form.username.error = 'The email / username field is required.'
        }

        if (form.password.model == '') {
            form.password.isInvalid = true
            form.password.error = 'The password field is required.'
        }
        loader.value = false
        return
    }

    await window.axios.post(apiRoute({ name: 'api:auth' }), {
        username: form.username.model,
        password: form.password.model,
        remember_me: rememberMe.value,
        user_agent: user_agent.value,
        coordinate: coordinate.value,
        device: device.value,
        access_type: 'Web App'
    })
    .then(async function(response) {
        if (response.data.status == true) {
            const authStore = useAuthStore()
            authStore.storeAuth(response.data.data.token)

            router.push({ name: 'console:system_start' })
        } else {
            if (response.data.error.username != undefined) {
                form.username.isInvalid = true
                form.username.error = response.data.error.username[0]            
            }

            if (response.data.error.password != undefined) {
                form.password.isInvalid = true
                form.password.error = response.data.error.password[0]            
            }
        }
    })
    .catch(function(error) {
        snackbar('Unexpected Error: ' + error)
    })

    loader.value = false
}

async function googleLogin() {
    loadingOverlay('show')
    
    await window.axios.get(apiRoute({ name: 'api:socialite_auth_redirect', 'params': { provider: 'google' } }))
        .then(function(response) {
            window.location.href = response.data.data.link
        })
}
</script>