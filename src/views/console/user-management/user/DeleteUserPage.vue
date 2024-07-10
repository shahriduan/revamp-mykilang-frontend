<template>
    <UserManagementPills />
    <x-content-header 
        title="Delete User" class="mb-3"
        :breadcrumbs="[{ route: { name: 'user.index' }, name: 'User List' }, { name: fullname }]"
        :previous-route="{ name: 'user.index' }"
    />
    <div class="card mt-3">
        <div class="card-body">
            Are you sure you want to delete user "<b>{{ fullname }}</b>". Once you delete an account, you won't be able to revert this. <br />
            To confirm deletion, type <i class="text-danger fw-bold">{{ username }}</i> in the text input field.
            <br /><br />
            <input type="text" id="form12" class="form-control" v-model="deleteUser" />
            <br />
            <button class="btn btn-primary" :disabled="disabledButton" @click="submitDeleteUser">
                Delete User
            </button>
        </div>
    </div>
</template>

<script setup>
import { snackbar } from '@/components/Snackbar'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiRoute from '@/helpers/ApiHelper'
import UserManagementPills from '@/views/console/user-management/UserManagementPills.vue'

const currentRoute = useRoute()
const router = useRouter()

const deleteUser = ref()
const username = ref()
const fullname = ref()
const disabledButton = ref(true)

onMounted(() => {
    getUserDetails()
})

watch(deleteUser, () => {
    disabledButton.value = deleteUser.value === username.value ? false : true
})

async function getUserDetails() {
    await window.axios.get(apiRoute({ name: 'api:user_management.user_details', params: { user: currentRoute.params.user } }))
        .then(function(response) {
            fullname.value = response.data.data.fullname
            username.value = response.data.data.username
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })
}

async function submitDeleteUser() {
    disabledButton.value = true

    await window.axios.post(apiRoute({ name: 'api:user_management.delete_user', params: { user: currentRoute.params.user } }))
        .then(function(response) {
            snackbar(response.data.message)
            router.replace({ name: 'user.index' })
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })
    
    disabledButton.value = false
}
</script>