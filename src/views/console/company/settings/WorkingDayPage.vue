<template>
    <SettingsTabs />
    <div class="card mt-4" v-if="listWorkingDays.length == 0 && authStore.userProfile.user_type == ConstantConfig.userType.client">
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

    <div v-else>
        <div v-if="listWorkingDays.length > 0 && contentLoader == true">
            <CircleSpinner class="mt-4" />
        </div>

        <div class="card mt-4" v-if="contentLoader == false">
            <div class="card-body border-bottom" :key="item.id" v-for="(item, index) in listWorkingDays">
                <p class="fw-bold mb-3">{{ item.factory_name }}</p>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :id="'monday' + index" type="checkbox" v-model="workingDay.is_monday.model[index]" :true-value="true" :false-value="false">
                    <label class="form-check-label" :for="'monday' + index">Monday</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :id="'tuesday' + index" type="checkbox" v-model="workingDay.is_tuesday.model[index]" :true-value="true" :false-value="false">
                    <label class="form-check-label" :for="'tuesday' + index">Tuesday</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :id="'wednesday' + index" type="checkbox" v-model="workingDay.is_wednesday.model[index]" :true-value="true" :false-value="false">
                    <label class="form-check-label" :for="'wednesday' + index">Wednesday</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :id="'thursday' + index" type="checkbox" v-model="workingDay.is_thursday.model[index]" :true-value="true" :false-value="false">
                    <label class="form-check-label" :for="'thursday' + index">Thursday</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :id="'friday' + index" type="checkbox" v-model="workingDay.is_friday.model[index]" :true-value="true" :false-value="false">
                    <label class="form-check-label" :for="'friday' + index">Friday</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :id="'saturday' + index" type="checkbox" v-model="workingDay.is_saturday.model[index]" :true-value="true" :false-value="false">
                    <label class="form-check-label" :for="'saturday' + index">Saturday</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :id="'sunday' + index" type="checkbox" v-model="workingDay.is_sunday.model[index]" :true-value="true" :false-value="false">
                    <label class="form-check-label" :for="'sunday' + index">Sunday</label>
                </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-primary" @click="submitWorkingDays()" :disabled="buttonLoader == true">
                    {{ buttonSubmitWorkingDay }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { snackbar } from '@/components/Snackbar'
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import SettingsTabs from '@/views/console/company/settings/SettingsTabs.vue'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'
import ConstantConfig from '@/config/ConstantConfig'

const authStore = useAuthStore()
const contentLoader = ref(true)
const buttonLoader = ref(false)
const buttonSubmitWorkingDay = ref('Save Working Days')

const listWorkingDays = ref([])

const workingDay = reactive({
    is_monday: { model: false, error: '' },
    is_tuesday: { model: false, error: '' },
    is_wednesday: { model: false, error: '' },
    is_thursday: { model: false, error: '' },
    is_friday: { model: false, error: '' },
    is_saturday: { model: false, error: '' },
    is_sunday: { model: false, error: '' },
})

onMounted(async() => {
    await getWorkingDays()
})

async function getWorkingDays() {
    await window.axios.get(apiRoute({ name: 'api:company.get_working_day'}))
    .then(function(response){
        listWorkingDays.value = response.data.data

        workingDay.is_monday.model = response.data.data.map(workingDay => workingDay.is_monday)
        workingDay.is_tuesday.model = response.data.data.map(workingDay => workingDay.is_tuesday)
        workingDay.is_wednesday.model = response.data.data.map(workingDay => workingDay.is_wednesday)
        workingDay.is_thursday.model = response.data.data.map(workingDay => workingDay.is_thursday)
        workingDay.is_friday.model = response.data.data.map(workingDay => workingDay.is_friday)
        workingDay.is_saturday.model = response.data.data.map(workingDay => workingDay.is_saturday)
        workingDay.is_sunday.model = response.data.data.map(workingDay => workingDay.is_sunday)
    })

    contentLoader.value = false
}

async function submitWorkingDays() {
    buttonLoader.value = true
    buttonSubmitWorkingDay.value = 'Saving ...'

    let hasError = false

    const requests = listWorkingDays.value.map((item, index) => {
        const isMondayFalse = workingDay.is_monday.model[index] === false
        const isTuesdayFalse = workingDay.is_tuesday.model[index] === false
        const isWednesdayFalse = workingDay.is_wednesday.model[index] === false
        const isThursdayFalse = workingDay.is_thursday.model[index] === false
        const isFridayFalse = workingDay.is_friday.model[index] === false
        const isSaturdayFalse = workingDay.is_saturday.model[index] === false
        const isSundayFalse = workingDay.is_sunday.model[index] === false

        if (isMondayFalse && isTuesdayFalse && isWednesdayFalse && isThursdayFalse && isFridayFalse && isSaturdayFalse && isSundayFalse) {
            // Skip saving for this factory if all day is unchecked
            hasError = true
            return Promise.resolve()
        }

        return window.axios.post(apiRoute({ name: 'api:company.submit_working_day' }), {
            company_id: authStore.userProfile.company_id,
            factory_id: item.factory_id,
            is_monday: workingDay.is_monday.model[index],
            is_tuesday: workingDay.is_tuesday.model[index],
            is_wednesday: workingDay.is_wednesday.model[index],
            is_thursday: workingDay.is_thursday.model[index],
            is_friday: workingDay.is_friday.model[index],
            is_saturday: workingDay.is_saturday.model[index],
            is_sunday: workingDay.is_sunday.model[index]
        })
        .then(function(response){
            snackbar(response.data.message)
        })
        .catch(function(error){
            snackbar('Unexpected Error: Unable to update factory working day.')
        })
    })

    Promise.all(requests)
        .finally(() => {
            buttonLoader.value = false
            buttonSubmitWorkingDay.value = 'Save Changes'

            if (hasError) {
                snackbar('Unsuccessful: Must select at least 1 working day for each factory.')
            }
        })
}
</script>
