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
            <h3>Change Email</h3>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-3">
            <AccountListGroup />
        </div>
        <div class="col-md-9 mt-4 mt-md-0">
            <div class="card">
                <div class="card-body">
                    <div class="row mb-3">
                        <label for="current_email" class="col-sm-2">Current Email</label>
                        <div class="col-sm-10">
                            <div class="input-group">
                                <input type="text" class="form-control" id="current_email" v-model="current_email" disabled />
                                <span class="input-group-text">
                                    <i class="fa-solid me-2" :class="{ 'fa-check': iconSuccess, 'fa-xmark': iconFail }"></i> {{ verify }}
                                </span>
                            </div>
                            <a href="javascript:;" style="text-decoration: underline" v-show="iconFail == true" @click="verifyCurrentEmail">
                                Verify your current email
                            </a>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="new_email" class="col-sm-2">New Email</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" :class="{ 'is-invalid': new_email.error }" id="new_email" v-model="new_email.model">
                            <div class="invalid-feedback">{{ new_email.error }}</div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-2"></div>
                        <div class="col-sm-10">
                            <button type="button" class="btn btn-primary" @click="changeNewEmail" :disabled="loader">
                                <span class="spinner-border spinner-border-sm me-1" v-show="loader"></span>
                                Update Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { loadingOverlay } from '@/components/LoadingOverlay'
import { snackbar } from '@/components/Snackbar'
import { useAuthStore } from '@/stores/AuthStore'
import AccountListGroup from '@/views/console/account/AccountListGroup.vue'
import apiRoute from '@/helpers/ApiHelper'

const verify = ref()
const iconSuccess = ref(true)
const iconFail = ref(false)
const loader = ref(false)

const current_email = ref()
const new_email = reactive({ model: '', error: '' })

const authStore = useAuthStore()
const userType = ref()

onMounted(() => {
    userType.value = authStore.userProfile.user_type
    getUserProfile()
})

async function getUserProfile() {
    await window.axios.get(apiRoute({ name: 'api:user_profile' }))
        .then(function(response) {
            var user = response.data.data

            current_email.value = user.email

            if (user.email_verified_at == null) {
                verify.value = 'Not Verified'
                iconFail.value = true
                iconSuccess.value = false
            } else {
                verify.value = 'Verified'
                iconSuccess.value = true
                iconFail.value = false
            }
        })
}

async function verifyCurrentEmail() {
    loadingOverlay('show')

    await window.axios.post(apiRoute({ name: 'api:account.verify_current_email' }))
        .then(function(response) {
            loadingOverlay('hide')
            snackbar(response.data.message)

            if (response.data.data.is_verified == true) {
                getUserProfile()
            }
        })
        .catch(function(error) {
            loadingOverlay('hide')
            snackbar('Unexpected Error')
        })
}

async function changeNewEmail() {
    loader.value = true

    await window.axios.post(apiRoute({ name: 'api:account.change_new_email' }), {
            new_email: new_email.model
        })
        .then(function(response) {
            if (response.data.status == true) {
                new_email.error = ''
                new_email.model = ''

                snackbar(response.data.message)

                if (response.data.data.reload == true) {
                    getUserProfile()
                }
            } else {
                new_email.error = response.data.error.new_email[0]

                if (response.data.error.new_email[1] == 'Reload') {
                    getUserProfile()
                }
            }
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })

        loader.value = false
}
</script>
