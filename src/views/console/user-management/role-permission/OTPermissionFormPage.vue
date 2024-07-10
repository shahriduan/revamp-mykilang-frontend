<template>
    <UserManagementPills />
    <div class="row">
        <div class="col-12 col-sm-9">
            <h3 v-if="$route.params.action == 'create'">Create new roles and permissions</h3>
            <h3 v-else>Edit roles and permissions</h3>
        </div>
        <div class="col-12 col-sm-3 text-end">
            <BackButton :route="{ name: 'ot_role.index' }" />
        </div>
    </div>
    <CircleSpinner class="mt-5" v-if="loader == true" />
    <div class="row mt-4" v-if="loader == false">
        <div class="card">
            <div class="card-body">
                <div class="row mb-4">
                    <div class="col-lg-6">
                        <label for="role_name" class="form-label fw-bold">Role Name</label>
                        <input type="email" class="form-control" :class="{ 'is-invalid': role_name.error }" id="role_name" v-model="role_name.model">
                        <div class="invalid-feedback">{{ role_name.error }}</div>
                    </div>
                </div>
                <div>
                    <h4 class="fw-bold">Permissions</h4>

                    <div class="list-group list-group-flush">
                        <div class="list-group-item">
                            <div class="row align-items-start">
                                <div class="col-auto">
                                    <input type="checkbox" class="form-check-input" v-model="selectAll" @change="markAllPermission(selectAll)">
                                </div>
                                <div class="col">
                                    <span class="text-reset d-block">Administrator Access</span>
                                    <div class="d-block text-secondary mt-n1">This role will get all access (Select all permissions below)</div>
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item" v-bind:key="index" v-for="(category, index) in datas">
                            <div class="row align-items-start">
                                <div class="col-auto">
                                    <input type="checkbox" class="form-check-input" v-model="selectedCategory[category.category.replace(' ', '_')]" @change="markPermissionByCategory(category.category.replace(' ', '_'))">
                                </div>
                                <div class="col">
                                    <span class="text-reset d-block">{{ category.category }}</span>
                                    <div class="d-block text-secondary mt-n1">{{ category.description }}</div>

                                    <div class="d-flex flex-wrap mt-2 mb-1">
                                        <div class="form-check form-check-inline me-4" v-bind:key="index" v-for="(permission, index) in category.list_permission">
                                            <input class="form-check-input" :class="'category_' + permission.category.replace(' ', '_')" type="checkbox" value="" :id="'permission' + permission.id" v-model="selectedPermission[permission.id]" :true-value="true" :false-value="false" />
                                            <label class="form-check-label" :for="'permission' + permission.id">{{ permission.readable_name }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="text-danger small px-2" v-show="permission_error">
                        <i class="fas fa-warning fa-lg me-2"></i> {{ permission_error }}
                    </div>
                </div>
                <div class="mt-4">
                    <button class="btn btn-primary" @click="submit" :disabled="buttonLoader">
                        <span class="spinner-border spinner-border-sm me-1" v-show="buttonLoader"></span>
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useRoute } from 'vue-router'
import UserManagementPills from '@/views/console/user-management/UserManagementPills.vue'
import BackButton from '@/components/BackButton.vue'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'

const currentRoute = useRoute()

const role_name = reactive({ model: '', error: '' })
const permission_error = ref('')
const selectAll = ref(false)
const datas = ref([]) /* List permission with group */
const categoryList = ref([]) /* List group only */
const selectedCategory = ref([])
const permissionList = ref([]) /* List permission only */
const selectedPermission = ref([])
const loader = ref(true)
const buttonLoader = ref(false)

onMounted(async() => {
    await getPermissions()

    if (currentRoute.params.action == 'edit') {
        getRoleDetails()
    }
})

// watch(selectedPermission, () => {
// TODO|Low: Checkbox select all & checkbox select all category
// })

async function getPermissions() {
    loader.value = true

    await window.axios.get(apiRoute({ name: 'api:user_management.ot_permission_list' }))
        .then(function(response) {
            datas.value = response.data.data

            datas.value.forEach(category => {
                categoryList.value.push(category)
                selectedCategory.value[category.category.replace(' ', '_')] = false

                category.list_permission.forEach(perm => {
                    permissionList.value.push(perm)
                    selectedPermission.value[perm.id] = false
                })
            })
        })

    loader.value = false
}

function markAllPermission(selected = false) {
    /* Mark all category */
    categoryList.value.map((val) => {
        selectedCategory.value[val.category.replace(' ', '_')] = selected == true ? true : false
    })

    /* Mark all permission */
    permissionList.value.map((val) => {
        selectedPermission.value[val.id] = selected == true ? true : false
    })
}

function markPermissionByCategory(category) {
    categoryList.value.forEach(cat => {
        if (cat.category == category.replace('_', ' ')) {
            cat.list_permission.map((val) => {
                selectedPermission.value[val.id] = selectedCategory.value[category] == true ? true : false
            })
        }
    })
}

async function getRoleDetails() {
    await window.axios.get(apiRoute({ name: 'api:user_management.ot_role_details', params: { role: currentRoute.params.role } }))
        .then(function(response) {
            response.data.data.permission.forEach(perm => {
                selectedPermission.value[perm.id] = true
                selectedCategory.value[perm.category.replace(' ', '_')] = true
            })

            role_name.model = response.data.data.name

            if (! selectedPermission.value.includes(false)) {
                selectAll.value = true
            }
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })
}

async function submit() {
    buttonLoader.value = true
    var parameter = currentRoute.params.action == 'create' ? { action: currentRoute.params.action } : { action: currentRoute.params.action, role: currentRoute.params.role }

    var selectedPermissionArray = Object.keys(selectedPermission.value)
        .filter(function(key) {
            return selectedPermission.value[key] === true
        })
        .map(value => parseInt(value))

    await window.axios.post(apiRoute({ name: 'api:user_management.submit_ot_role_permission', params: parameter }), {
            role_name: role_name.model,
            permission: selectedPermissionArray
        })
        .then(function(response) {
            if (response.data.status == true) {
                if (currentRoute.params.action == 'create') {
                    role_name.model = ''
                    selectAll.value = false
                    markAllPermission(false)
                }

                role_name.error = ''
                permission_error.value = ''

                snackbar(response.data.message)
            } else {
                role_name.error = response.data.error.role_name != undefined ? response.data.error.role_name[0] : ''
                permission_error.value = response.data.error.permission != undefined ? response.data.error.permission[0] : ''
            }
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })

    buttonLoader.value = false
}
</script>
