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
            <h3>Security Checks</h3>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-3">
            <AccountListGroup />
        </div>
        <div class="col-md-9">
            <div class="card mt-4 mt-md-0">
                <div class="card-body">
                    <CircleSpinner class="mt-4" v-if="loader" />
                    <div v-if="loader == false">
                        <h4>Current Session</h4>
                        <ul class="list-group list-group-light">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="ms-3">
                                    <p class="fw-bold mb-1">{{ currentSession[0]?.user_agent }}</p>
                                    <p class="text-muted mb-0">Coordinate: {{ currentSession[0]?.coordinate }}</p>
                                    <p class="mb-0 text-success">This Device</p>
                                </div>
                            </li>
                        </ul>
                        <div v-if="otherDevices.length > 0">
                            <h4 class="mt-2">Logins on other devices</h4>
                            <ul class="list-group list-group-light">
                                <TransitionGroup name="fade">
                                    <li class="list-group-item d-flex justify-content-between align-items-center" v-for="otherDevice in otherDevices" :key="otherDevice">
                                        <div class="ms-3">
                                            <p class="fw-bold mb-0">{{ otherDevice.user_agent }}</p>
                                            <p class="text-muted mb-0">
                                                Coordinate:
                                                <a :href="otherDevice.link" v-if="otherDevice.coordinate != 'Unknown'" target="_blank">
                                                    {{ otherDevice.coordinate }}
                                                </a>
                                                <span v-else>{{ otherDevice.coordinate }}</span>
                                            </p>
                                            <p class="text-muted mb-0">{{ otherDevice.last_active }}</p>
                                        </div>
                                        <a class="btn btn-falcon-danger btn-sm" href="javascript:;" @click="terminateSession(otherDevice)">
                                            Terminate
                                        </a>
                                    </li>
                                </TransitionGroup>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useAuthStore } from '@/stores/AuthStore'
import apiRoute from '@/helpers/ApiHelper'
import AccountListGroup from '@/views/console/account/AccountListGroup.vue'
import CircleSpinner from '@/components/CircleSpinner.vue'

const otherDevices = ref([])
const currentSession = ref([])
const loader = ref(false)

const authStore = useAuthStore()
const userType = ref()

onMounted(() => {
    userType.value = authStore.userProfile.user_type
    getActiveSessions()
})

async function getActiveSessions(haveLoader = true) {
    if (haveLoader == true) {
        loader.value = true
    }

    await window.axios.get(apiRoute({ name: 'api:account.get_active_session' }))
        .then(function(response) {
            var sessions = response.data.data

            otherDevices.value = sessions.filter((data) => {
                return data.this_device == false
            }).map(readableCoordinate)

            currentSession.value = sessions.filter((data) => {
                return data.this_device == true
            }).map(readableCoordinate)
        })

    if (haveLoader == true) {
        loader.value = false
    }
}

function readableCoordinate(data) {
    if (data.coordinate == null) {
        data.link = ''
        data.coordinate = 'Unknown'
    } else {
        data.link = 'https://www.google.com/maps/search/?api=1&query=' + data.coordinate
        data.coordinate = data.coordinate.split(',').join(', ')
    }

    return data
}

async function terminateSession(device) {
    const i = otherDevices.value.indexOf(device)
    if (i > -1) {
        otherDevices.value.splice(i, 1)
    }
    await window.axios.post(apiRoute({ name: 'api:account.terminate_session' }), {
            token_id: device.id
        })
        .catch(function(error) {
            snackbar('Unexpected error: Unable to terminate session')
        })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}
</style>
