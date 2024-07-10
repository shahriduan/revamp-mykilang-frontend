<template>
    <x-content-header
        :title="$route.params.action == 'create' ? 'New Factory' : 'Edit Factory'" class="mb-3"
        :breadcrumbs="[{ route: { name: 'factory.list' }, name: 'Factory List' }, { name: $route.params.action == 'create' ? 'New Factory' : breadcrumbTitle }]"
        :previous-route="{ name: 'factory.list' }"
    />

    <CircleSpinner class="mt-5" v-if="contentLoader == true" />

    <div class="card mt-3" v-if="contentLoader == false">
        <div class="card-body">
            <div class="row mb-3">
                <label for="name" class="col-sm-2">
                    Name <x-asterisk />
                </label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" :class="{ 'is-invalid': factoryForm.name.error }" id="name" v-model="factoryForm.name.model">
                    <div class="invalid-feedback">{{ factoryForm.name.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="description" class="col-sm-2">
                    Description
                </label>
                <div class="col-sm-10">
                    <textarea rows="4" class="form-control" placeholder="Write a message" :class="{ 'is-invalid': factoryForm.description.error }" id="description" v-model="factoryForm.description.model" style="resize: none"></textarea>
                    <span class="invalid-feedback">{{ factoryForm.description.error }}</span>
                </div>
            </div>
            <div class="row mb-3">
                <label for="person_in_charge" class="col-sm-2">
                    Person In Charge
                </label>
                <div class="col-sm-10">
                    <input class="form-control cursor-pointer" @click="showModalListUserCompany(user_id)" placeholder="Choose person in charge" v-model="namePersonInCharge" id="person_in_charge" :class="{ 'is-invalid': factoryForm.person_in_charge.error }" readonly>
                </div>
            </div>
            <div class="row mb-3">
                <label for="subsidiary" class="col-sm-2">
                    Subsidiary
                </label>
                <div class="col-sm-10">
                    <select class="form-select" placeholder="Choose subsidiary" :class="{ 'is-invalid': factoryForm.subsidiary.error}" v-model="factoryForm.subsidiary.model">
                        <option value="">None</option>
                        <option :value="subsidiary.id" :key="index" v-for="(subsidiary, index) in listSubsidiary">
                            {{ subsidiary.subsidiary_name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ factoryForm.subsidiary.error }}</div>
                    <small>If you do not have subsidiary, ignore this field</small>
                </div>
            </div>
            <div class="row mb-3">
                <label class="col-sm-2 pt-0">Status <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" :class="{ 'is-invalid': factoryForm.status.error }" type="radio" name="factory-status" id="status-active" v-model="factoryForm.status.model" :value="true" />
                        <label class="form-check-label mb-0 pb-0" for="status-active">Active</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" :class="{ 'is-invalid': factoryForm.status.error }" type="radio" name="factory-status" id="status-inactive" v-model="factoryForm.status.model" :value="false" />
                        <label class="form-check-label mb-0 pb-0" for="status-inactive">Non-Active</label>
                    </div>
                    <div class="invalid-feedback">{{ factoryForm.status.error }}</div>
                </div>
            </div>
            <div class="row mb-3">
                <label for="subsidiary" class="col-sm-2">Timezone <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                    <select class="form-select" placeholder="Choose timezone" :class="{ 'is-invalid': factoryForm.timezone.error}" v-model="factoryForm.timezone.model">
                        <option value="Asia/Kuala_Lumpur">(GMT +08:00) Asia/Kuala Lumpur</option>
                        <option :value="timezone.name" :key="index" v-for="(timezone, index) in filteredTimezones">
                            (GMT {{ timezone.offset }}) {{ timezone.name.replace(/_/g, ' ') }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ factoryForm.timezone.error }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="button" class="btn btn-primary" @click="submitFactory" :disabled="submitLoader">
                        <span class="spinner-border spinner-border-sm me-1" v-show="submitLoader"></span>
                        Save Factory
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="listUserCompany" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <span>List of Users Company</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body" style="height: 100vh;">
                    <div>
                        <input type="text" class="form-control form-control-lg" placeholder="Search person in charge for this factory" v-model="searchPICs" @keyup="filteredListUsers()">
                        <hr style="height: 5px; background: darkmagenta; "/>
                    </div>

                    <div v-if="(filteredUsers.length > 0)">
                        <ul class="list-group list-group-light" v-if="modalLoader == false">
                            <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 cursor-pointer" @click="changeRadioPIC(''); personInCharge('', '')">
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        :id="'radiousernone'"
                                        type="radio"
                                        value=""
                                        v-model="factoryForm.person_in_charge.model"
                                    />
                                    <div class="form-check-label fw-bold">None</div>
                                </div>
                            </li>
                            <li
                                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-1 cursor-pointer"
                                :key="listUsersCompany"
                                v-for="listUsersCompany in filteredUsers"
                                @click="changeRadioPIC(listUsersCompany.id); personInCharge(listUsersCompany.id, listUsersCompany.fullname)">
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        :id="'radiouser' + listUsersCompany.id"
                                        type="radio"
                                        :value="listUsersCompany.id"
                                        v-model="factoryForm.person_in_charge.model"
                                    />
                                    <div class="form-check-label fw-bold">{{ listUsersCompany.fullname }}</div>
                                    <div class="text-muted">{{ listUsersCompany.email }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        No User Found.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, reactive } from 'vue'
import { snackbar } from '@/components/Snackbar'
import { useAuthStore } from '@/stores/AuthStore'
import { axiosGetTimezoneList } from '@/helpers/AxiosApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'
import apiRoute from '@/helpers/ApiHelper'
import 'animate.css'

const authStore = useAuthStore()
const breadcrumbTitle = ref('')
const modalUserbyCompanyId = ref()
const currentRoute = useRoute()
const submitLoader = ref(false)
const contentLoader = ref(false)
const listSubsidiary = ref([])
const namePersonInCharge = ref('')
const idPersonInCharge = ref('')
const listUsersCompanies = ref([])
const filteredUsers = ref([])
const modalLoader = ref(false)
const searchPICs = ref('')
const listTimezones = ref([])

const factoryForm = reactive({
    name: { model: '', error: '' },
    description: { model: '', error: '' },
    person_in_charge: { model: '', error: '' },
    subsidiary: { model: '', error: '' },
    status: { model: true , error: '' },
    timezone: { model: 'Asia/Kuala_Lumpur', error: '' },
})

// Filter out 'Asia/Kuala_Lumpur' from the list of timezones
const filteredTimezones = computed(() => {
    return listTimezones.value.filter(timezone => timezone.name !== 'Asia/Kuala_Lumpur');
});

function filteredListUsers() {
    filteredUsers.value = listUsersCompanies.value.filter((item) => {
        return Object.keys(item).some(
            (key) => item['fullname'].toLowerCase().includes(searchPICs.value.toLowerCase())
        );
    })
}

onMounted(async () => {
    if (currentRoute.params.action == 'edit') {
        contentLoader.value = true
    }

    await getSubsidiaries()

    if (currentRoute.params.action == 'edit') {
        await getFactoryDetails()
        contentLoader.value = false
    }

    await axiosGetTimezoneList((response) => {
        listTimezones.value = response.data.data
    })
})

function changeRadioPIC(user_id) {
    factoryForm.person_in_charge.model = user_id
}

async function getSubsidiaries() {
    await window.axios.get(apiRoute({ name: 'api:subsidiary.list' }))
        .then(function(response) {
            listSubsidiary.value = response.data.data
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })
}

async function getUserListBasedOnCompany() {
    await window.axios.get(apiRoute({ name: 'api:user_management.list_user_company', params: { user: modalUserbyCompanyId.value }, query: { search: searchPICs.value } }))
        .then(function(response) {
            listUsersCompanies.value = response.data.data
            filteredUsers.value = response.data.data
        })
}

async function showModalListUserCompany(user_id) {
    modalLoader.value = true

    const myModalEl = document.getElementById('listUserCompany')
    const modal = new bootstrap.Modal(myModalEl, {
        keyboard: false
    })
    modal.show()

    modalUserbyCompanyId.value = user_id

    await getUserListBasedOnCompany(user_id)

    modalLoader.value = false
}


function personInCharge(pic_id, pic_name) {
    idPersonInCharge.value = pic_id
    namePersonInCharge.value = pic_name
}

function closeModal() {
    modalLoader.value = false
    modalUserbyCompanyId.value = ''
}

async function getFactoryDetails() {
    await window.axios.get(apiRoute({ name: 'api:factory.details', params: { factory: currentRoute.params.factory } }))
        .then(function(response) {
            factoryForm.name.model = breadcrumbTitle.value = response.data.data.name
            factoryForm.description.model = response.data.data.description
            factoryForm.person_in_charge.model = response.data.data.person_in_charge_id
            namePersonInCharge.value = response.data.data.person_in_charge_name
            factoryForm.subsidiary.model = response.data.data.subsidiary_id != null ? response.data.data.subsidiary_id : ''
            factoryForm.status.model = response.data.data.status
            factoryForm.timezone.model = response.data.data.timezone != null ? response.data.data.timezone : ''
        })
}

async function submitFactory() {
    submitLoader.value = true

    var parameter = currentRoute.params.action == 'create' ? { action: currentRoute.params.action } : { action: currentRoute.params.action, factory: currentRoute.params.factory }

    await window.axios.post(apiRoute({ name: 'api:factory.submit', params: parameter }), {
            factory_name: factoryForm.name.model,
            description: factoryForm.description.model,
            person_in_charge: factoryForm.person_in_charge.model,
            subsidiary_id: factoryForm.subsidiary.model,
            status: factoryForm.status.model,
            timezone: factoryForm.timezone.model,
            company_id: authStore.userProfile.company_id,
        })
        .then(function(response) {
            if(response.data.status == true) {
                if (currentRoute.params.action == 'create') {
                    factoryForm.name.model = factoryForm.name.error = ''
                    factoryForm.description.model = factoryForm.description.error = ''
                    factoryForm.person_in_charge.model = factoryForm.person_in_charge.error = ''
                    factoryForm.subsidiary.model = factoryForm.subsidiary.error = ''
                    factoryForm.status.model = true
                    factoryForm.timezone.model = factoryForm.timezone.error = ''
                    factoryForm.status.error = ''
                }

                snackbar(response.data.message)
            } else {
                factoryForm.name.error = response.data.error.factory_name != undefined ? response.data.error.factory_name[0] : ''
                factoryForm.description.error = response.data.error.description != undefined ? response.data.error.description[0] : ''
                factoryForm.person_in_charge.error = response.data.error.person_in_charge != undefined ? response.data.error.person_in_charge[0] : ''
                factoryForm.subsidiary.error = response.data.error.subsidiary != undefined ? response.data.error.subsidiary[0] : ''
                factoryForm.timezone.error = response.data.error.timezone != undefined ? response.data.error.timezone[0] : ''
                factoryForm.status.error = response.data.error.status != undefined ? response.data.error.status[0] : ''
            }
        })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })

    submitLoader.value = false
}
</script>
