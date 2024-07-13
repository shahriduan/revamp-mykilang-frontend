<template>
    <SettingsTabs />
    <div class="card mt-4">
        <div class="card-body">
            <div class="row mb-3">
                <label for="start-date" class="col-sm-2">Start <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                    <input class="form-control flatpickr" :class="{ 'is-invalid' : holiday.startDate.error }" type="text" id="start_date" v-model="holiday.startDate.model">
                    <div class="text-danger small">{{ holiday.startDate.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="end-date" class="col-sm-2">End <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                    <input class="form-control flatpickr" :class="{ 'is-invalid' : holiday.endDate.error }" type="text" id="end_date"  v-model="holiday.endDate.model">
                    <div class="text-danger small">{{ holiday.endDate.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="" class="col-sm-2">Description <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                    <textarea class="form-control" :class="{ 'is-invalid' : holiday.description.error }" id="description" v-model="holiday.description.model" style="resize: none" rows="3"></textarea>
                    <div class="text-danger small">{{ holiday.description.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="" class="col-sm-2">Factory <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                    <VueMultiselect
                        v-model="holiday.factory.model"
                        :options="listFactories"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        placeholder="Select factory"
                        label="name"
                        track-by="name"
                    />
                    <div class="text-danger small">{{ holiday.factory.error }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="button" class="btn btn-primary" @click="submitNewHoliday" :disabled="submitLoader">
                        <span class="spinner-border spinner-border-sm me-1" v-show="submitLoader"></span>
                        {{ buttonSubmitNewHoliday }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <ul class="list-group mt-4">
        <li class="list-group-item d-flex flex-column flex-md-row justify-content-md-between align-items-md-center" v-for="holiday in holidays" v-bind:key="holiday.id">
            <div>
                <h5>{{ holiday.factory_name }}</h5>
                <div class="fs-1">{{ holiday.description }}</div>
                <p>{{ holiday.start_date}} - {{ holiday.end_date }}</p>
                <p class="mb-0">Updated by: {{ holiday.updated_by }}</p>
            </div>
            <div class="mt-3 mt-md-0">
                <button class="btn btn-falcon-default btn-sm" style="margin-right: 10px;" type="button" :disabled="disabledButton" data-bs-toggle="modal" :data-bs-target="'#editModal' + holiday.id" @click="setEditableHoliday(holiday)">
                    <i class="bi bi-pencil"></i> Edit
                </button>

                <div class="modal fade" :id="'editModal' + holiday.id"  tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 500px">
                        <div class="modal-content position-relative">
                        <div class="position-absolute top-0 end-0 mt-2 me-2 z-1">
                            <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                                <h4 class="mb-1" id="modalExampleDemoLabel">Edit Holiday </h4>
                            </div>
                            <div class="p-4 pb-0">
                                <div class="row mb-3">
                                    <label for="start-date" class="col-sm-3">Start <span class="text-danger">*</span></label>
                                    <div class="col-sm-9">
                                        <input class="form-control flatpickr" :class="{ 'is-invalid' : editableHoliday.startDate.error }" type="text" v-model="editableHoliday.startDate.model">
                                        <div class="text-danger small">{{ editableHoliday.startDate.error }}</div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="end-date" class="col-sm-3">End <span class="text-danger">*</span></label>
                                    <div class="col-sm-9">
                                        <input class="form-control flatpickr" :class="{ 'is-invalid' : editableHoliday.endDate.error }" type="text"  v-model="editableHoliday.endDate.model">
                                        <div class="text-danger small">{{ editableHoliday.endDate.error }}</div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="" class="col-sm-3">Description <span class="text-danger">*</span></label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control" :class="{ 'is-invalid' : editableHoliday.description.error }" id="description" v-model="editableHoliday.description.model"></textarea>
                                        <div class="text-danger small">{{ editableHoliday.description.error }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary position-relative" @click="editHoliday(holiday.id, holiday.end_date)" :disabled="submitLoader">
                                <span class="spinner-border spinner-border-sm me-1" v-show="submitLoader"></span>
                                {{buttonSubmitNewHoliday}}
                            </button>
                        </div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-falcon-danger btn-sm" type="button" :disabled="disabledButton" @click="deleteHoliday(holiday.id, holiday.end_date, 'Delete holiday '+ holiday.start_date + ' - ' + holiday.end_date)">
                    <i class="bi bi-trash3"></i> Delete
                </button>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { onMounted, ref, reactive, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import { useAuthStore } from '@/stores/AuthStore'
import { confirmDialog } from '@/components/SweetAlert'
import dayjs from 'dayjs'
import flatpickr from 'flatpickr'
import SettingsTabs from '@/views/console/company/settings/SettingsTabs.vue'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'
import VueMultiselect from 'vue-multiselect'

const holidays = ref()
const authStore = useAuthStore()
const submitLoader = ref(false)
const contentLoader = ref(true)
const buttonLoader = ref (false)
const disabledButton = ref(false)
const buttonEditHoliday = ref('Save Changes')
const buttonSubmitNewHoliday = ref('Save Holiday')
const company_id = authStore.userProfile.company_id
const listFactories = ref([])

const holiday = reactive ({
    startDate: { model: '', error: ''},
    endDate: { model: '', error: ''},
    description: { model: '', error: ''},
    factory: { model: [], error: '' }
})

// TODO: Optimized modal component. Load only 1 modal component

onMounted(async () => {
    await getHolidayList();

    await getFactories();

    flatpickr('#start_date, #end_date', {
        dateFormat: 'd/m/Y',
        disableMobile: true
    })

    contentLoader.value = false
})

onUpdated(async () => {
    flatpickr('.flatpickr', {
        dateFormat: 'd/m/Y',
        disableMobile: true
    })
})

async function getFactories() {
    await window.axios.get(apiRoute({ name: 'api:factory.list' }))
        .then(function(response) {
            listFactories.value = response.data.data
        })
}

async function submitNewHoliday() {
    buttonLoader.value = true
    buttonSubmitNewHoliday.value = 'Save Changes'

    await window.axios.post(apiRoute({ name: 'api:company.submit_new_holiday'}), {
        company_id: authStore.userProfile.company_id,
        start_date: holiday.startDate.model != '' ? dayjs(holiday.startDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
        end_date: holiday.endDate.model != '' ? dayjs(holiday.endDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
        description: holiday.description.model,
        factory: holiday.factory.model.map(factory => factory.id)
    })
    .then(function(response) {
        if (response.data.status == true) {
            holiday.startDate.model = holiday.startDate.error = ''
            holiday.endDate.model = holiday.endDate.error = ''
            holiday.description.model = holiday.description.error = ''
            holiday.factory.model = holiday.factory.error = ''

            snackbar(response.data.message)
            getHolidayList()
        } else {
            holiday.startDate.error = response.data.error.start_date != undefined ? response.data.error.start_date[0] : ''
            holiday.endDate.error = response.data.error.end_date != undefined ? response.data.error.end_date[0] : ''
            holiday.description.error = response.data.error.description != undefined ? response.data.error.description[0] : ''
            holiday.factory.error = response.data.error.factory != undefined ? response.data.error.factory[0] : ''

            if (response.data.message == 'ERROR') {
                snackbar(response.data.error)
            }
        }
    });

    buttonLoader.value = false
    buttonSubmitNewHoliday.value = 'Save Changes'
}

async function getHolidayList() {
    await window.axios.get(apiRoute({ name: 'api:company.get_holiday'}))
        .then(function(response) {
            holidays.value = response.data.data.map(holiday => {
                holiday.start_date = dayjs(holiday.start_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
                holiday.end_date = dayjs(holiday.end_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
                holiday.id
                holiday.factory_name
                holiday.updated_by
                return holiday;
            });
        })
}

async function deleteHoliday(holiday_id, holiday_endDate, msg) {
    const currentDate = dayjs()
    const formattedDate = currentDate.format('YYYY-MM-DD')
    const convertEndDate = dayjs(holiday_endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')

    if (dayjs(convertEndDate).isAfter(formattedDate)) {
        confirmDialog(msg, () => {
            window.axios.post(apiRoute({ name: 'api:company.delete_holiday'}), {
                id: holiday_id
            })
            .then(function(response){
                snackbar(response.data.message)
                getHolidayList(false)
            })
            .catch(function(error){
                snackbar('Unexpected error')
            })
        })
    } else {
        snackbar('Cannot delete: Holiday end date has already passed')
    }
}

const editableHoliday = reactive({
    startDate: { model: '', error: '' },
    endDate: { model: '', error: '' },
    description: { model: '', error: '' },
})

function setEditableHoliday(holiday) {
    editableHoliday.startDate.model = holiday.start_date
    editableHoliday.endDate.model = holiday.end_date
    editableHoliday.description.model = holiday.description
}

async function editHoliday(holiday_id, holiday_endDate) {
    const currentDate = dayjs()
    const formattedDate = currentDate.format('YYYY-MM-DD')
    const convertEndDate = dayjs(holiday_endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')

    if (dayjs(convertEndDate).isAfter(formattedDate)){
        const convertedStartDate = dayjs(editableHoliday.startDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD')
        const convertedEndDate = dayjs(editableHoliday.endDate.model, 'DD/MM/YYYY').format('YYYY-MM-DD')

        buttonLoader.value = true
        buttonEditHoliday.value = 'Saving ...'

        await window.axios.post(apiRoute({ name: 'api:company.edit_holiday' }), {
            id: holiday_id,
            start_date: convertedStartDate,
            end_date: convertedEndDate,
            description: editableHoliday.description.model,
        })
        .then(function(response) {
            if (response.data.status == true) {
                editableHoliday.startDate.model = editableHoliday.startDate.error = ''
                editableHoliday.endDate.model = editableHoliday.endDate.error = ''
                editableHoliday.description.model = editableHoliday.description.error = ''

                snackbar(response.data.message)
                getHolidayList()

                const modalEditHoliday = document.getElementById('editModal'+ holiday_id)
                const closeModal = bootstrap.Modal.getOrCreateInstance(modalEditHoliday)
                closeModal.hide()
            } else {
                editableHoliday.startDate.error = response.data.error.start_date != undefined ? response.data.error.start_date[0] : ''
                editableHoliday.endDate.error = response.data.error.end_date != undefined ? response.data.error.end_date[0] : ''
                editableHoliday.description.error = response.data.error.description != undefined ? response.data.error.description[0] : ''

                snackbar(response.data.error)
            }
        })

        buttonLoader.value = false
        buttonEditHoliday.value = 'Save changes'
    } else {
        snackbar('Cannot edit: Holiday end date has already passed')
    }
}
</script>
