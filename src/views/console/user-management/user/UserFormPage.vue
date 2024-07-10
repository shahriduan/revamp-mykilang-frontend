<template>
    <UserManagementPills />
    <x-content-header
        :title="$route.params.action == 'create' ? 'Create New User' : 'Edit User'" class="mb-3"
        :breadcrumbs="[{ route: { name: 'user.index' }, name: 'User List' }, { name: $route.params.action == 'create' ? 'New User' : breadcrumbTitle }]"
        :previous-route="{ name: 'user.index' }"
    />
    <Circlespinner class="mt-5" v-if="contentLoader == true" />
    <div v-if="contentLoader == false">
        <div v-if="(roleList.length == 0 && otRoleList.length == 0) || (factoryList.length == 0 && authStore.userProfile.user_type == ConstantConfig.userType.client)">
            <div class="card mt-3" v-if="roleList.length == 0">
                <div class="card-body">
                    <div class="row justify-content-between align-items-center">
                        <div class="col-md">
                            <h5 class="mb-2 mb-md-0">
                                <i class="fas fa-info-circle me-2"></i> Opss.. You don't have any role created.
                            </h5>
                        </div>
                        <div class="col-auto">
                            <router-link class="btn btn-falcon-default btn-sm me-2" :to="{ name: 'role.form', params: { action: 'create' } }">
                                Create New IT Role
                            </router-link>
                            <span>or</span>
                            <router-link class="btn btn-falcon-default btn-sm ms-2 me-2" :to="{ name: 'ot_role.form', params: { action: 'create' } }">
                                Create New OT Role
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mt-3" v-if="factoryList.length == 0 && authStore.userProfile.user_type == ConstantConfig.userType.client">
                <div class="card-body">
                    <div class="row justify-content-between align-items-center">
                        <div class="col-md">
                            <h5 class="mb-2 mb-md-0">
                                <i class="fas fa-info-circle me-2"></i> Opss.. You don't have any factory created.
                            </h5>
                        </div>
                        <div class="col-auto">
                            <router-link class="btn btn-falcon-default btn-sm me-2" :to="{ name: 'factory.list'}">
                                Create New Factory
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card mt-3" v-else>
            <div class="card-body">
                <div class="row mb-3">
                    <label for="full_name" class="col-sm-2">
                        Full Name <span class="text-danger">*</span>
                    </label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" :class="{ 'is-invalid': fullname.error }" id="full_name" v-model="fullname.model">
                        <div class="invalid-feedback">{{ fullname.error }}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="email" class="col-sm-2">
                        Email <span class="text-danger">*</span>
                    </label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" :class="{ 'is-invalid': email.error }" id="email" v-model="email.model">
                        <div class="invalid-feedback">{{ email.error }}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="username" class="col-sm-2">
                        Username <span class="text-danger">*</span>
                    </label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" :class="{ 'is-invalid': username.error }" id="username" v-model="username.model">
                        <div class="invalid-feedback">{{ username.error }}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="username" class="col-sm-2">
                        Role <span class="text-danger">*</span>
                    </label>
                    <div class="col-sm-10">
                        <div class="row">
                            <div class="col-md-6 text-center pe-md-0">
                                <div class="border border-secondary-subtle">
                                    <label class="form-label">Web App (IT)</label>
                                </div>
                                <div class="border border-secondary-subtle p-1">
                                    <select class="form-select" :class="{ 'is-invalid': role.error }" v-model="role.model" style="border: 0px; outline:0px">
                                        <option value="">No Access</option>
                                        <option :value="roleData.id" v-for="roleData in roleList">
                                            {{ roleData.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="text-danger small">{{ role.error }}</div>
                                <div class="small" v-if="roleList.length == 0">
                                    You don't have IT role created.
                                    <router-link :to="{ name: 'role.index' }" class="text-primary" style="text-decoration: underline">
                                        Create here.
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-md-6 text-center ps-md-0">
                                <div class="border border-secondary-subtle">
                                    <label class="form-label">Desktop App (OT)</label>
                                </div>
                                <div class="border border-secondary-subtle p-1">
                                    <select class="form-select" :class="{ 'is-invalid': ot_role.error }" v-model="ot_role.model" style="border: 0px; outline:0px">
                                        <option value="">No Access</option>
                                        <option :value="otRoleData.id" v-for="otRoleData in otRoleList">
                                            {{ otRoleData.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="text-danger small">{{ ot_role.error }}</div>
                                <div class="small" v-if="otRoleList.length == 0">
                                    You don't have OT role created.
                                    <router-link :to="{ name: 'ot_role.index' }" class="text-primary" style="text-decoration: underline">
                                        Create here.
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mb-3" v-if="$route.params.action == 'create'">
                    <label for="password" class="col-sm-2">
                        Password <span class="text-danger">*</span>
                    </label>
                    <div class="col-sm-10">
                        <div class="input-group">
                            <input type="text" class="form-control" :class="{ 'is-invalid': password.error }" id="password" v-model="password.model">
                            <button class="btn btn-outline-primary" type="button" @click="autoGeneratePassword">
                                <i class="fa-solid fa-arrows-rotate me-1" :class="{ 'fa-spin' : spinIcon }" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count:1"></i> Auto-generate
                            </button>
                        </div>
                        <div class="text-danger small mt-1">{{ password.error }}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="col-sm-2 pt-0">Status</label>
                    <div class="col-sm-10">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" :class="{ 'is-invalid': status.error }" type="radio" name="user-status" id="status-active" v-model="status.model" :value="true" />
                            <label class="form-check-label mb-0 pb-0" for="status-active">Active</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" :class="{ 'is-invalid': status.error }" type="radio" name="user-status" id="status-inactive" v-model="status.model" :value="false" />
                            <label class="form-check-label mb-0 pb-0" for="status-inactive">Inactive</label>
                        </div>
                        <div class="text-danger small">{{ status.error }}</div>
                    </div>
                </div>
                <div class="row mb-3" v-if="authStore.userProfile.user_type == ConstantConfig.userType.client">
                    <label class="col-sm-2 pt-0">Data Access</label>
                    <div class="col-sm-10">
                        <div class="mb-2 fs-0">Grant this user access to the factory data.</div>
                        <div class="form-check mb-0" :class="{ 'is-invalid': factoryError }" v-for="factory in factoryList">
                            <input class="form-check-input" :class="{ 'is-invalid': factoryError }" :id="'factory' + factory.id" type="checkbox" v-model="factoryModel" :value="factory.id" />
                            <label class="form-check-label" :for="'factory' + factory.id">{{ factory.name }}</label>
                        </div>
                        <div class="invalid-feedback">{{ factoryError }}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-10 offset-sm-2">
                        <button type="button" class="btn btn-primary" @click="submit" :disabled="submitLoader">
                            <span class="spinner-border spinner-border-sm me-1" v-show="submitLoader"></span>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import UserManagementPills from '@/views/console/user-management/UserManagementPills.vue'
import UtilityHelper from '@/helpers/UtilityHelper'
import apiRoute from '@/helpers/ApiHelper'
import Circlespinner from '@/components/CircleSpinner.vue'
import ConstantConfig from '@/config/ConstantConfig'

const currentRoute = useRoute()
const authStore = useAuthStore()

const breadcrumbTitle = ref('')

const fullname = reactive({ model: '', error: '' })
const email = reactive({ model: '', error: '' })
const username = reactive({ model: '', error: '' })
const role = reactive({ model: '', error: '' })
const password = reactive({ model: '', error: '' })
const status = reactive({ model: true, error: '' })
const ot_role = reactive({ model: '', error: '' })
const factoryModel = ref([])
const factoryError = ref('')

const submitLoader = ref(false)
const contentLoader = ref(false)
const spinIcon = ref(false)
const roleList = ref([])
const otRoleList = ref([])
const factoryList = ref([])

onMounted(async () => {
    contentLoader.value = true

    await getRoles()
    await getOTRoles()

    if (authStore.userProfile.user_type == ConstantConfig.userType.client) {
        await getFactories()
    }

    if (currentRoute.params.action == 'edit') {
        await getUserDetails()
        contentLoader.value = false
    }

    contentLoader.value = false
})

async function getRoles() {
    await window.axios.get(apiRoute({ name: 'api:user_management.role_list' }))
        .then(function(response) {
            roleList.value = response.data.data
        })
}

async function getOTRoles() {
    await window.axios.get(apiRoute({ name: 'api:user_management.ot_role_list' }))
        .then(function(response) {
            otRoleList.value = response.data.data
        })
}

async function getFactories() {
    await window.axios.get(apiRoute({ name: 'api:factory.list' }))
        .then(function(response) {
            factoryList.value = response.data.data
        })
}

async function getUserDetails() {
    await window.axios.get(apiRoute({ name: 'api:user_management.user_details', params: { user: currentRoute.params.user } }))
        .then(function(response) {
            fullname.model = breadcrumbTitle.value = response.data.data.fullname
            email.model = response.data.data.email
            username.model = response.data.data.username
            role.model = response.data.data.role?.id ?? ''
            ot_role.model = response.data.data.ot_role?.id ?? ''
            status.model = response.data.data.status

            var userAccessFactory = []

            response.data.data.factory.map((value) => {
                userAccessFactory.push(value.id)
            })

            factoryModel.value = userAccessFactory
        })
}

function autoGeneratePassword() {
    spinIcon.value = true

    const upperCase = 'ABZDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
    const number = '1234567890'

    var utilityHelper = new UtilityHelper
    var randomUpperCase = utilityHelper.generateRandomString(2, upperCase)
    var randomLowerCase = utilityHelper.generateRandomString(4, lowerCase)
    var randomNumber = utilityHelper.generateRandomString(2, number)

    var combine = randomUpperCase + randomLowerCase + '@' + randomNumber
    password.model = combine

    setTimeout(() => {
        spinIcon.value = false
    }, 500)
}

async function submit() {
    submitLoader.value = true

    var parameter = currentRoute.params.action == 'create' ? { action: currentRoute.params.action } : { action: currentRoute.params.action, user: currentRoute.params.user }

    await window.axios.post(apiRoute({ name: 'api:user_management.submit_user', params: parameter }), {
            fullname: fullname.model,
            email: email.model,
            username: username.model,
            it_role: role.model,
            ot_role: ot_role.model,
            password: password.model,
            status: status.model,
            factory: factoryModel.value
        })
        .then(function(response) {
            if (response.data.status == true) {
                if (currentRoute.params.action == 'create') {
                    fullname.model = email.model = username.model = role.model = ot_role.model = password.model = password.error = ''
                    status.model = true
                    factoryModel.value = []
                }

                fullname.error = email.error = username.error = role.error = ot_role.error = status.error = factoryError.value = ''

                snackbar(response.data.message)
            } else {
                fullname.error = response.data.error.fullname != undefined ? response.data.error.fullname[0] : ''
                email.error = response.data.error.email != undefined ? response.data.error.email[0] : ''
                username.error = response.data.error.username != undefined ? response.data.error.username[0] : ''
                role.error = response.data.error.it_role != undefined ? response.data.error.it_role[0] : ''
                ot_role.error = response.data.error.ot_role != undefined ? response.data.error.ot_role[0] : ''
                password.error = response.data.error.password != undefined ? response.data.error.password[0] : ''
                status.error = response.data.error.status != undefined ? response.data.error.status[0] : ''
                factoryError.value = response.data.error.factory != undefined ? response.data.error.factory[0] : ''

                snackbar(response.data.message)
            }
        })

    submitLoader.value = false
}
</script>
