<template>
    <UserManagementPills />
    <div class="row">
        <div class="col-12">
            <h3>Desktop Roles List</h3>
            <small class="text-muted">
                A role provides access to predefined menus and features so that depending on the assigned role a user can have access to what he need.
            </small>
        </div>
    </div>
    <CircleSpinner class="mt-5" v-if="loader === true" />
    <div class="row mt-1 gy-4" v-if="loader === false">
        <div class="col-sm-6 col-lg-6 col-xl-4" v-show="$can('role.add')">
            <router-link :to="{ name: 'console:ot_role.form', params: { action: 'create' }}" style="text-decoration: none;">
                <div class="card h-100">
                    <div class="row h-100">
                        <div class="col-5">
                            <div class="d-flex align-items-end h-100 justify-content-center mt-sm-0">
                                <img src="/img/illustrations/girl-using-mobile.png" class="img-fluid mt-sm-4 mt-md-0" alt="role" width="83">
                            </div>
                        </div>
                        <div class="col-7">
                            <div class="card-body text-sm-end text-end ps-sm-0">
                                <button type="button" class="btn btn-primary mb-2 text-nowrap waves-effect waves-light">Add New Role</button>
                                <p class="mb-0 mt-1">Add role, if it does not exist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="col-sm-6 col-lg-6 col-xl-4" v-for="role in roles" :key="role.id">
            <div class="card h-100">
                <div class="card-body role-background">
                    <div class="d-flex role-list" @click="showModalRole(role.id)">
                        <h6 class="mb-0" style="line-height: 1.375">
                            Total {{ role.ot_role_users_count }} users
                        </h6>
                        <div class="ms-1">
                            <i class="fa-solid fa-angle-right fa-xs"></i>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-end mt-1">
                        <div class="role-heading">
                            <h4 class="mb-1">{{ role.name }}</h4>
                            <router-link :to="{ name: 'console:ot_role.form', params: { action: 'edit', 'role': role.id } }" v-show="$can('role.edit')">
                                <span>Edit Permissions</span>
                            </router-link>
                            <span class="mx-1" v-show="role.ot_role_users_count == 0 && $can('role.delete')">|</span>
                            <a href="javascript:;" v-show="role.ot_role_users_count == 0 && $can('role.delete')" @click="deleteRole('Delete ' + role.name + ' role', role.id)">
                                <span>Delete Role</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal animate__animated animate__zoomIn animate__faster" data-bs-backdrop="static" id="listUser" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <span>List of users by <b>{{ modalTitle }}</b></span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <div v-if="listUsers.length > 0">
                        <ul class="list-group list-group-light" v-if="modalLoader == false">
                            <li class="list-group-item d-flex justify-content-between align-items-center py-1" v-for="listUser in listUsers">
                                <div>
                                    <div class="fw-bold">{{ listUser.fullname }}</div>
                                    <div class="text-muted">{{ listUser.email }}</div>
                                </div>
                                <span class="badge rounded-pill" :class="[listUser.status == true ? 'badge-success' : 'badge-danger']">
                                    {{ listUser.status == true ? 'Active' : 'Inactive' }}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        No user is assigned to this role.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { confirmDialog } from '@/components/SweetAlert'
import { snackbar } from '@/components/Snackbar'
import { can } from '@/helpers/PermissionHelper'
import UserManagementPills from '@/views/console/user-management/UserManagementPills.vue'
import CircleSpinner from '@/components/CircleSpinner.vue'
import apiRoute from '@/helpers/ApiHelper'
import 'animate.css'

const roles = ref()
const loader = ref(true)

const modalTitle = ref('')
const modalRoleId = ref()
const listUsers = ref([])
const modalLoader = ref(false)

onMounted(() => {
    if (can('role.list')) {
        getRoles()
    }
})

async function getRoles(enableLoading = true) {
    if (enableLoading == true) {
        loader.value = true
    }

    await window.axios.get(apiRoute({ name: 'api:user_management.ot_role_list' }))
        .then(function(response) {
            roles.value = response.data.data
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })

    if (enableLoading == true) {
        loader.value = false
    }
}

async function showModalRole(role_id) {
    modalLoader.value = true
    const myModalEl = document.getElementById('listUser')
    const modal = new bootstrap.Modal(myModalEl, {
        keyboard: false
    })
    modal.show()

    modalRoleId.value = role_id

    await getListUserByRoles(role_id)

    modalLoader.value = false
}

async function getListUserByRoles(role_id) {
    await window.axios.get(apiRoute({ name: 'api:user_management.ot_role_details', params: { role: role_id } }))
        .then(function(response) {
            modalTitle.value = response.data.data.name
            listUsers.value = response.data.data.users
        })
}

function closeModal() {
    modalTitle.value = ''
    modalRoleId.value = ''
}

function deleteRole(msg, role_id) {
    confirmDialog(msg, () => {
        window.axios.post(apiRoute({ name: 'api:user_management.delete_ot_role', params: { role: role_id } }))
            .then(function(response) {
                snackbar(response.data.message)
                getRoles(false)
            })
            .catch(function(error) {
                snackbar('Unexpected Error')
            })
    })
}
</script>

<style lang="css" scoped>
.role-background {
    background-image: url(/img/illustrations/corner-2.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: right center;
}
.role-list {
    cursor: pointer;
}
.role-list:hover {
    text-decoration: underline;
    font-weight: bold;
}
</style>
