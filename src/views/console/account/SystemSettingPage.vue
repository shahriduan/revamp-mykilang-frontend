<template>
    <router-link class="nav-link fw-bold mb-2 mt-1" :class="{ active: ['console_home'].includes($route.name) }"
        :to="{ name: 'console_home' }" role="button" v-if="userType !== 'HQ'">
        <div class="d-flex align-items-center">
            <span class="nav-link-icon">
                <span class="fa-solid fa-arrow-left"></span>
            </span>
            <span class="nav-link-text ps-1">BACK TO CONSOLE HOME</span>
        </div>
    </router-link>
    <div class="row">
        <div class="col-md-4">
            <h3>System Settings</h3>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-3">
            <AccountListGroup />
        </div>
        <div class="col-md-9 mt-4 mt-md-0">
            <div class="card">
                <div class="card-body">
                    <h4 style="font-weight: 900;">Appearance</h4>
                    <div class="mt-4"></div>
                    <h6 class="fw-bold mb-0">Dark mode</h6>
                    <small>Adjust the appearance of system to reduce glare and give your eyes a break.</small>
                    <br>
                    <div class="d-flex flex-row mb-1">
                        <div class="p-2">
                            <div class="d-flex flex-column">
                                <div class="p-1">
                                    <img src="/img/logos/light_preview.svg" alt="light"
                                        class="theme-img border border-dark img-fluid" value="light"
                                        @click="theme = 'light'">
                                </div>
                                <div class="p-1">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input theme-img" type="radio" id="theme-light"
                                            v-model="theme" value="light" />
                                        <label class="form-check-label theme-img" for="theme-light">Off</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-2">
                            <div class="d-flex flex-column">
                                <div class="p-1">
                                    <img src="/img/logos/dark_preview.svg" alt="dark"
                                        class="theme-img border border-dark img-fluid" value="dark"
                                        @click="theme = 'dark'">
                                </div>
                                <div class="p-1">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input theme-img" type="radio" id="theme-dark"
                                            v-model="theme" value="dark" />
                                        <label class="form-check-label theme-img" for="theme-dark">On</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-2">
                <div class="card-body">
                    <h4 style="font-weight: 900;">Time Zone</h4>
                    <div class="mt-2"></div>
                    <small>Change to you desired time zone.</small>
                    <br>
                    <div class="mt-1">
                        <select class="form-select" id="timezone" size="1" name="timezone" v-model="selectedTimeZone">
                            <option v-for="timezone in timeZoneData" :key="timezone.id" :value="timezone.name">
                                (UTC{{ timezone.offset }}) {{ timezone.zone }}/{{ timezone.location }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { snackbar } from '@/components/Snackbar.js'
import { useAuthStore } from '@/stores/AuthStore'
import AccountListGroup from '@/views/console/account/AccountListGroup.vue'
import apiRoute from '@/helpers/ApiHelper.js'

const theme = ref(localStorage.getItem('theme'))
const timeZoneData = ref(null)
const selectedTimeZone = ref('')
const userSetting = ref(null)
const selectedUserSettings = ref(null)

const authStore = useAuthStore()
const userType = ref()

onMounted(async () => {
    userType.value = authStore.userProfile.user_type

    await getTimeZones()
    await getUserSettings()
})

watch(theme, () => {
    localStorage.setItem('theme', theme.value)

    if (theme.value === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        submitTimeZone()
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        submitTimeZone()
    }
})

watch(selectedTimeZone, () => {
    if (selectedTimeZone.value) {
        submitTimeZone()
    }
})

async function getTimeZones() {
    await window.axios.get(apiRoute({ name: 'api:get_timezones' }))
        .then(function (response) {
            timeZoneData.value = response.data.data
        })
        .catch(function (error) {
            snackbar('Error retrieving the data !')
        })
}

async function getUserSettings() {
    await window.axios.get(apiRoute({ name: 'api:account.user_settings' }))
        .then(function (response) {
            userSetting.value = response.data.data
            selectedTimeZone.value = userSetting.value.timezone  // Set the selectedTimeZone to the default from API
        })
        .catch(function (error) {
            snackbar('Error retrieving the data !')
        })
}

async function submitTimeZone() {
    await window.axios.post(apiRoute({ name: 'api:account.submit_user_settings' }), {
        timezone: selectedTimeZone.value,
        theme: theme.value
    })
    .then(function (response) {
        selectedUserSettings.value = response.data.data
    })
    .catch(function (error) {
        snackbar('Error retrieving the data !')
    })
}
</script>

<style lang="css" scoped>
.theme-img {
    cursor: pointer;
}
</style>
