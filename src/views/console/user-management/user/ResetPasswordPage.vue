<template>
    <UserManagementPills />
    <x-content-header 
        title="Reset Password" class="mb-3"
        :breadcrumbs="[{ route: { name: 'console:user.index' }, name: 'User List' }, { name: $route.query.fullname ?? 'Reset Password'  }]"
        :previous-route="{ name: 'console:user.index' }"
    />
    <div class="card mt-3">
        <div class="card-body">
            <div class="row mb-3">
                <label for="password" class="col-sm-2">
                    Password <span class="text-danger">*</span>
                </label>
                <div class="col-sm-10">
                    <div class="input-group">
                        <input type="text" class="form-control" :class="{ 'is-invalid': password.error }" id="password" v-model="password.model">
                        <button class="btn btn-outline-primary" type="button" data-mdb-ripple-color="dark" @click="generatePassword">
                            <i class="fa-solid fa-arrows-rotate me-1"></i> Auto-generate
                        </button>
                    </div>
                    <div class="text-danger small mt-1">{{ password.error }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" v-model="sendEmail" id="send-email" :true-value="true" :false-value="false" />
                        <label class="form-check-label" for="send-email">Send a new password to this user email.</label>
                    </div>
                    <br />
                    <button type="button" class="btn btn-primary" @click="submit" :disabled="submitLoader">
                        <span class="spinner-border spinner-border-sm me-1" v-show="submitLoader"></span>
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useRoute } from 'vue-router'
import UserManagementPills from '@/views/console/user-management/UserManagementPills.vue'
import UtilityHelper from '@/helpers/UtilityHelper'
import apiRoute from '@/helpers/ApiHelper'

const currentRoute = useRoute()
const password = reactive({ model: '', error: '' })
const sendEmail = ref(false)
const submitLoader = ref(false)

function generatePassword() {
    var utilityHelper = new UtilityHelper
    password.model = utilityHelper.autoGeneratePassword()
}

async function submit() {
    submitLoader.value = true

    await window.axios.post(apiRoute({ name: 'api:user_management.reset_password', params: { user: currentRoute.params.user } }), {
            password: password.model,
            send_email: sendEmail.value
        })
        .then(function(response) {
            if (response.data.status == true) {
                password.model = password.error = ''
                sendEmail.value = false
                snackbar(response.data.message)
            } else {
                password.error = response.data.error.password != undefined ? response.data.error.password[0] : ''
            }
        })

    submitLoader.value = false
}
</script>