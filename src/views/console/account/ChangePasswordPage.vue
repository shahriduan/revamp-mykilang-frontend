<template>
    <router-link class="nav-link fw-bold mb-2 mt-1" :class="{ active: ['console_home'].includes($route.name) }" :to="{ name: 'console_home' }" role="button" v-if="userType !== 'HQ'">
        <div class="d-flex align-items-center">
            <span class="nav-link-icon">
                <span class="fa-solid fa-arrow-left"></span>
            </span>
            <span class="nav-link-text ps-1">BACK TO CONSOLE HOME</span>
        </div>
    </router-link>
    <div class="row">
        <div class="col-md-4">
            <h3>Change Password</h3>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-3">
            <AccountListGroup />
        </div>
        <div class="col-md-9 mt-4 mt-md-0">
            <div class="card">
                <div class="card-body">
                    <form @submit.prevent="updatePassword">
                        <div class="row mb-3">
                            <label for="current_password" class="col-sm-4">Current Password</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" :class="{ 'is-invalid': current_password.error }" id="current_password" v-model="current_password.model">
                                <div class="invalid-feedback">{{ current_password.error }}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="new_password" class="col-sm-4">New Password</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" :class="{ 'is-invalid': new_password.error }" id="new_password" v-model="new_password.model">
                                <div class="invalid-feedback">{{ new_password.error }}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="new_password_confirmation" class="col-sm-4">New Password Confirmation</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" :class="{ 'is-invalid': new_password_confirmation.error }" id="new_password_confirmation" v-model="new_password_confirmation.model" placeholder="Retype your new password">
                                <div class="invalid-feedback">{{ new_password_confirmation.error }}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-sm-4"></div>
                            <div class="col-sm-8">
                                <b>New Password Requirements</b>
                                <br>
                                <ul class="list-unstyled">
                                    <li class="small" :class="{'text-success': minChar.textSuccess, 'text-danger': minChar.textDanger }">
                                        <i class="me-2" :class="{'fas fa-check': minChar.pass, 'fa-regular fa-circle fa-xs': minChar.failed }"></i> Minimum <b>5</b> characters long - the more, the better.
                                    </li>
                                    <li class="small" :class="{'text-success': lowerChar.textSuccess, 'text-danger': lowerChar.textDanger }">
                                        <i class="me-2" :class="{'fas fa-check': lowerChar.pass, 'fa-regular fa-circle fa-xs': lowerChar.failed }"></i> At least <b>one</b> lowercase character.
                                    </li>
                                    <li class="small" :class="{'text-success': upperChar.textSuccess, 'text-danger': upperChar.textDanger }">
                                        <i class="me-2" :class="{'fas fa-check': upperChar.pass, 'fa-regular fa-circle fa-xs': upperChar.failed }"></i> At least <b>one</b> uppercase character.
                                    </li>
                                    <li class="small" :class="{'text-success': number.textSuccess, 'text-danger': number.textDanger }">
                                        <i class="me-2" :class="{'fas fa-check': number.pass, 'fa-regular fa-circle fa-xs': number.failed }"></i> At least <b>one</b> number.
                                    </li>
                                    <li class="small" :class="{'text-success': symbol.textSuccess, 'text-danger': symbol.textDanger }">
                                        <i class="me-2" :class="{'fas fa-check': symbol.pass, 'fa-regular fa-circle fa-xs': symbol.failed }"></i> At least <b>one</b> symbol.
                                    </li>
                                </ul>
                                <button type="submit" class="btn btn-primary mt-2" :disabled="submitNotReady || loader">
                                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-show="loader"></span>
                                    <span>Update Password</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch, ref, reactive } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useAuthStore } from '@/stores/AuthStore'
import AccountListGroup from '@/views/console/account/AccountListGroup.vue'
import apiRoute from '@/helpers/ApiHelper'

const minChar = reactive({ regex: /^.{5,}$/, textSuccess: false, textDanger: true, pass: false, failed: true })
const lowerChar = reactive({ regex: /[a-z]/, textSuccess: false, textDanger: true, pass: false, failed: true })
const upperChar = reactive({ regex: /[A-Z]/, textSuccess: false, textDanger: true, pass: false, failed: true })
const number = reactive({ regex: /\d/, textSuccess: false, textDanger: true, pass: false, failed: true })
const symbol = reactive({ regex: /.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-/].*/, textSuccess: false, textDanger: true, pass: false, failed: true })
const submitNotReady = ref(true)
const loader = ref(false)

const current_password = reactive({ model: '', error: ''})
const new_password = reactive({ model: '', error: ''})
const new_password_confirmation = reactive({ model: '', error: ''})

const authStore = useAuthStore()
const userType = ref()

onMounted(() => {
    userType.value = authStore.userProfile.user_type
})

watch(new_password, () => {
    if (minChar.regex.test(new_password.model)) {
        minChar.textDanger = false
        minChar.textSuccess = true
        minChar.pass = true
        minChar.failed = false
    } else {
        minChar.textDanger = true
        minChar.textSuccess = false
        minChar.pass = false
        minChar.failed = true
    }

    if (lowerChar.regex.test(new_password.model)) {
        lowerChar.textDanger = false
        lowerChar.textSuccess = true
        lowerChar.pass = true
        lowerChar.failed = false
    } else {
        lowerChar.textDanger = true
        lowerChar.textSuccess = false
        lowerChar.pass = false
        lowerChar.failed = true
    }

    if (upperChar.regex.test(new_password.model)) {
        upperChar.textDanger = false
        upperChar.textSuccess = true
        upperChar.pass = true
        upperChar.failed = false
    } else {
        upperChar.textDanger = true
        upperChar.textSuccess = false
        upperChar.pass = false
        upperChar.failed = true
    }

    if (number.regex.test(new_password.model)) {
        number.textDanger = false
        number.textSuccess = true
        number.pass = true
        number.failed = false
    } else {
        number.textDanger = true
        number.textSuccess = false
        number.pass = false
        number.failed = true
    }

    if (symbol.regex.test(new_password.model)) {
        symbol.textDanger = false
        symbol.textSuccess = true
        symbol.pass = true
        symbol.failed = false
    } else {
        symbol.textDanger = true
        symbol.textSuccess = false
        symbol.pass = false
        symbol.failed = true
    }

    if (minChar.regex.test(new_password.model) && lowerChar.regex.test(new_password.model) && upperChar.regex.test(new_password.model) && number.regex.test(new_password.model) && symbol.regex.test(new_password.model)) {
        submitNotReady.value = false
    } else {
        submitNotReady.value = true
    }
})

async function updatePassword() {
    loader.value = true

    await window.axios.post(apiRoute({ name: 'api:account.update_password' }), {
            current_password: current_password.model,
            new_password: new_password.model,
            new_password_confirmation: new_password_confirmation.model
        })
        .then(function(response) {
            if (response.data.status == true) {
                current_password.model = current_password.error = new_password.model = new_password.error = new_password_confirmation.model = new_password_confirmation.error = ''

                snackbar(response.data.message)
            } else {
                current_password.error = response.data.error.current_password != undefined ? response.data.error.current_password[0] : ''
                new_password.error = response.data.error.new_password != undefined ? response.data.error.new_password[0] : ''
                new_password_confirmation.error = response.data.error.new_password_confirmation != undefined ? response.data.error.new_password_confirmation[0] : ''
            }
        })

    loader.value = false
}
</script>
