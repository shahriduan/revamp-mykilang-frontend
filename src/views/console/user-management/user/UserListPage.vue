<template>
    <UserManagementPills />
    <x-content-header title="User List" class="mb-3" />   
    <div class="row gy-2 d-flex align-items-center justify-content-center">
        <div class="col-md-8">
            <div class="row gy-2">
                <div class="col-7 col-lg-6">
                    <input class="form-control" type="text" placeholder="Search" v-model="search" @keyup="debounceSearch">
                </div>
                <div class="col-5 col-lg-6">
                    <select class="form-select" v-model="status" @change="getUsers">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="row d-flex align-items-center justify-content-center" v-if="dataPackage && dataPackage.length > 0">
                <div class="col-3 col-md-5 text-end" v-show="$can('user.add')">
                    <router-link :class="authStore.userProfile.user_type == ConstantConfig.userType.client && totalUsers >= numberOfUser ? 'disabled' : ''" :to="{ name: 'user.form', params: { action: 'create' } }" class="btn btn-outline-dark px-3">
                        <i class="fas fa-plus me-1"></i>New User
                    </router-link>
                </div>
                <div class="col-8 col-md-7">
                    <div class="card mb-0">
                        <div class="card-body p-2 m-0">
                            <div class="d-flex justify-content-between" style="font-size: small; flex-wrap: wrap;">
                                <div>Total Users:</div>
                                <div><span class="fw-bold text-dark">{{ totalUsers }}</span>/<span>{{ numberOfUser }}</span></div>
                            </div>
                            <div class="progress" style="height: 5px;" role="progressbar" :aria-valuenow="(totalUsers / numberOfUser) * 100" aria-valuemin="0" aria-valuemax="100">
                                <div class="progress-bar" :style="{ width: (totalUsers / numberOfUser) * 100 + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row d-flex align-items-center justify-content-center" v-else>
                <div class="col-12 text-end" v-show="$can('user.add')">
                    <router-link :class="authStore.userProfile.user_type == ConstantConfig.userType.client && totalUsers >= numberOfUser ? 'disabled' : ''" :to="{ name: 'user.form', params: { action: 'create' } }" class="btn btn-outline-dark px-3">
                        <i class="fas fa-plus me-1"></i>New User
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <div v-if="authStore.userProfile.user_type == ConstantConfig.userType.client && totalUsers >= numberOfUser && contentLoader == false">
        <div class="alert alert-warning mt-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            The total users of package subscribed has already reached the limit.
        </div>
    </div>
    <CircleSpinner class="mt-5" v-if="contentLoader == true" />
    <div class="card mt-2" v-if="contentLoader == false">
        <div class="card-body px-0 pt-0 pb-1">
            <div class="table-reponsive scrollbar" id="table-responsive" >
                <table class="table table-sm mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th class="fw-bolder">#</th>
                            <th class="fw-bolder">Name</th>
                            <th class="fw-bolder">Username 
                                <i class="fas fa-info-circle ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Can be use to login."></i>
                            </th>
                            <th class="fw-bolder">Email
                                <i class="fas fa-info-circle ms-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Can be use to login."></i>
                            </th>
                            <th class="fw-bolder">Role</th>
                            <th class="fw-bolder">Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="users.length > 0">
                            <tr v-bind:key="index" v-for="(user, index) in users">
                                <th scope="row">{{ index + iteration }}</th>
                                <td>{{ user.fullname }}</td>
                                <td>{{ user.username }}</td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <span class="badge badge-subtle-secondary" :class="{ 'me-1': user.role != null }" v-if="user.role != null">
                                        IT: {{ user.role?.name }}
                                    </span>
                                    <span class="badge badge-subtle-secondary" v-if="user.ot_role != null">
                                        OT: {{ user.ot_role?.name }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge badge-subtle-success" v-if="user.status == true">Active</span>
                                    <span class="badge badge-subtle-danger" v-else>Inactive</span>
                                </td>
                                <td class="text-end py-0 align-middle">
                                    <div class="dropdown dropstart" v-show="$can(['user.edit', 'user.delete', 'user.reset_password'])">
                                        <button class="btn btn-icon btn-round btn-text-dark btn-hover-light-dark font-weight-bold" type="button" id="dropdown-active-user" data-bs-toggle="dropdown" data-boundary="viewport" aria-haspopup="true" aria-expanded="false">
                                            <span class="fas fa-ellipsis fa-2x"></span>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-end border py-2" aria-labelledby="dropdown-active-user">
                                            <router-link v-if="$can('user.edit')" class="dropdown-item" :to="{ name: 'user.form', params: { action: 'edit', user: user.id } }">
                                                <i class="bi bi-pencil fa-lg me-2"></i> Edit
                                            </router-link>
                                            <router-link v-if="$can('user.delete')" class="dropdown-item" :to="{ name: 'user.delete_user', params: { user: user.id } }">
                                                <i class="bi bi-trash fa-lg me-2"></i> Delete
                                            </router-link>
                                            <router-link v-if="$can('user.reset_password')" class="dropdown-item" :to="{ name: 'user.reset_password', params: { user: user.id }, query: { fullname: user.fullname } }">
                                                <i class="bi bi-lock fa-lg me-2"></i> Reset Password
                                            </router-link>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="6" class="text-center">No record found.</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Bootstrap5Pagination :data="pagination" @pagination-change-page="getUsers" class="mt-3" :limit="1" :keep-length="true">
        <template v-slot:prev-nav>Previous</template>
        <template v-slot:next-nav>Next</template>
    </Bootstrap5Pagination>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bootstrap5Pagination } from 'laravel-vue-pagination'
import { useDebounceFn } from '@vueuse/core'
import { can } from '@/helpers/PermissionHelper'
import { useAuthStore } from '@/stores/AuthStore'
import ConstantConfig from '@/config/ConstantConfig'
import UserManagementPills from '@/views/console/user-management/UserManagementPills.vue'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'

const authStore = useAuthStore()
const search = ref()
const status = ref('')
const users = ref([])
const pagination = ref([])
const iteration = ref(0)
const contentLoader = ref(false)
const companyId = ref('')
const totalUsers = ref(0)
const numberOfUser = ref(0)
const dataPackage = ref(null)

const debounceSearch = useDebounceFn(async () => {
    getUsers()
}, 200)

onMounted(async () => {
    if (can('user.list')) {
        contentLoader.value = true
        await getUsers()
        contentLoader.value = false
    }

    await getCompanySubscription()

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

async function getUsers(page = 1) {
    await window.axios.get(apiRoute({ name: 'api:user_management.user_list', query: { page: page, search: search.value, status: status.value } }))
        .then(function(response) {
            users.value = response.data.data
            pagination.value = response.data
            iteration.value = response.data.meta.from
            totalUsers.value = response.data.data != '' ? response.data.data[0].company == null ? 0 : response.data.data[0].company.total_users - 1 : 0 // minus 1 root user
            companyId.value = response.data.data != '' ? response.data.data[0].company == null ? '' : response.data.data[0].company.id : ''
        })
}

async function getCompanySubscription() {
    await window.axios.get(apiRoute({ name: 'api:company.subscribed_package', query: { company: companyId.value } }))
        .then(function(response) {
            numberOfUser.value = response.data.data != '' ? response.data.data[0].number_of_users == null ? 0 : response.data.data[0].number_of_users : 0
            dataPackage.value = response.data.data
        })
}
</script>
