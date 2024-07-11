<template>
    <div class="mb-3">
        <x-content-header title="User sesssion" />
    </div>

    <div class="row">
        <div class="col-sm-6 col-md-6 col-lg-6">
            <div class="card h-100 border shadow-none">
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <span class="fw-bold h5 mb-0">Cloud Console</span><br>
                            <span class="align-middle">Total Active User: {{ webAccessCount }}</span>
                        </div>
                        <div class="col-6 text-end">
                            <a class="btn btn-falcon-danger btn-sm" href="javascript:;" @click="terminateAllSession('Web App')">
                                Terminate
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="col-sm-6 col-md-6 col-lg-6">
            <div class="card h-100 border shadow-none">
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <span class="fw-bold h5">On-Premise</span><br>
                            <span class="align-middle">Total Active User: {{ otAccessCount }}</span>
                        </div>
                        <div class="col-6 text-end">
                            <a class="btn btn-falcon-danger btn-sm" href="javascript:;" @click="terminateAllSession('Desktop App')">
                                Terminate
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-2">
        <div class="col-sm-6 col-md-6 col-lg-6">
            <div class="text-center"><h5 class="text-white" style="background-color: #152b48;">List of Web Access User</h5></div>
            <ul class="list-group list-group-light" ref="webUserList" @scroll="handleScroll">
                <li class="list-group-item d-flex justify-content-between align-items-center"  v-for="(webUser, index) in activeUsers.filter(user => user.access_type === 'Web App')" :key="'webUser-' + index">
                    <div class="ms-3">
                        <span class="fw-bold mb-0">{{ webUser.name }} ({{ webUser.user_type }}) </span>
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="text-muted mb-0 me-3">Email: {{ webUser.email }}</p>
                            <p class="text-muted mb-0">Last Active: {{ formatDate(webUser.last_active_at) }}</p>
                        </div>                 
                    </div>
                </li>
            </ul>
            <div v-if="loading" class="text-center mt-2">Loading...</div>
        </div>
        <div class="col-sm-6 col-md-6 col-lg-6">
            <div class="text-center"><h5 class="text-white" style="background-color: #152b48;">List of OT User</h5></div>
            <ul class="list-group list-group-light" ref="otUserList" @scroll="handleScroll">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(otUser, index) in activeUsers.filter(user => user.access_type === 'Desktop App')" :key="'otUser-' + index">
                    <div class="ms-3">
                        <span class="fw-bold mb-0">{{ otUser.name }} ({{ otUser.user_type }}) </span>
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="text-muted mb-0 me-3">Email: {{ otUser.email }}</p>
                            <p class="text-muted mb-0">Last Active: {{ formatDate(otUser.last_active_at) }}</p>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="loading" class="text-center mt-2">Loading...</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { confirmDialog } from '@/components/SweetAlert'
import apiRoute from '@/helpers/ApiHelper'

const activeUsers = ref([])
const currentPage = ref(1)
const limit = 20
const loading = ref(false)
const endReached = ref(false)

onMounted(async () => {
    await loadMoreUsers()
})

async function getAllActiveUser() {
    await window.axios.get(apiRoute({ name: 'api:user_session.user_active_session_list' }))
        .then(function (response) {
            activeUsers.value = response.data.data
        })
        .catch(function (error) {
            snackbar('Error in retrieving data!')
        })
}

async function loadMoreUsers() {
    if (loading.value || endReached.value) return
    loading.value = true

    try {
        const response = await window.axios.get(apiRoute({ name: 'api:user_session.user_active_session_list', query: { page: currentPage.value, limit } }))
        const newUsers = response.data.data
        if (newUsers.length < limit) {
        endReached.value = true
        }
        activeUsers.value.push(...newUsers)
        currentPage.value++
    } catch (error) {
        snackbar('Error in retrieving data!')
    } finally {
        loading.value = false
    }
}

const webAccessCount = computed(() =>
    activeUsers.value.filter(user => user.access_type === 'Web App').length
)

const otAccessCount = computed(() =>
    activeUsers.value.filter(user => user.access_type === 'Desktop App').length
)

async function terminateAllSession(accessType) {
    const message = 'Do you really want to terminate all sessions for ' + accessType + '?'

    confirmDialog(message, async() => {
        window.axios.post(apiRoute({ name: 'api:user_session.submit_terminate_active_user' }), {
            access_type: accessType
        })
        .then(function(response) {
            snackbar('Sessions terminated successfully')
            currentPage.value = 1
            activeUsers.value = []
            endReached.value = false
            loadMoreUsers() // Refresh the list after termination
        })
        .catch(function(error) {
            snackbar('Unexpected error: Unable to terminate session')
        })
    })
}

function formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0') // Convert to 12-hour format
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`
}

// Handle Scroll Event
function handleScroll(event) {
    const element = event.target
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        loadMoreUsers()
    }
}
</script>