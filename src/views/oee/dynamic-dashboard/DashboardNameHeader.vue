<template>
    <div class="d-flex justify-content-between align-items-center mb-4 mt-3">
        <div v-if="! isEditing">
            <h5 class="mb-0 text-default position-relative d-inline" @click="startEditing">
                <span class="dark__bg-5000 pe-3">{{ dashboardName }}</span>
            </h5>
            <div class="dropdown font-sans-serif btn-reveal-trigger d-inline">
                <button class="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal"
                    type="button" id="action-dashboard" data-bs-toggle="dropdown" data-boundary="viewport"
                    aria-haspopup="true" aria-expanded="false">
                    <span class="fas fa-ellipsis-v fs-0"></span>
                </button>
                <div class="dropdown-menu dropdown-menu-end border py-2" aria-labelledby="action-dashboard">
                    <a class="dropdown-item" href="#" @click="startEditing">Edit</a>
                    <a class="dropdown-item text-danger" href="#" @click="deleteDashboard">Delete</a>
                </div>
            </div>
        </div>
        <div v-else class="mb-0 text-default position-relative w-100">
            <div class="input-group">
                <input
                    ref="dashboardInputRef"
                    id="user-dashboard-name"
                    v-model="dashboardNameInput"
                    class="form-control"
                    @keyup.enter="saveChanges"
                />
                <button class="btn btn-outline-primary" @click="saveChanges">Save</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onUpdated, ref } from 'vue'
import { confirmDialog } from '@/components/SweetAlert'
import { useRouter } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'

const props = defineProps({
    dashboard: {
        type: Object,
        required: true,
        default() {
            return {}
        }
    }
})

const router = useRouter()

const dashboardName = ref(null) // Use for display
const dashboardNameInput = ref(null) // Use on input text
const currentProps = ref({})

const isEditing = ref(false)

onUpdated(() => {
    if (currentProps.value?.id != props.dashboard.id) {
        currentProps.value = props.dashboard
        dashboardName.value = props.dashboard.dashboard_name
    }
})

function startEditing() {
    dashboardNameInput.value = dashboardName.value
    isEditing.value = true

    nextTick(() => document.getElementById('user-dashboard-name').focus())
}

async function saveChanges() {
    // If user edit something, update dashboard name
    if (dashboardNameInput.value != dashboardName.value) {
        await window.axios.post(apiRoute({ name: 'api_oee:user_dashboard.submit', params: { dashboardUuid: props.dashboard.uuid } }), {
                dashboard_name: dashboardNameInput.value
            })
            .then(response => {
                router.push({ name: 'oee.dashboard.custom', query: { udsb: `${props.dashboard.id}|${dashboardNameInput.value}` } }) // Use for update sidebar dashboard name
            })
    }

    dashboardName.value = dashboardNameInput.value
    isEditing.value = false
}

async function deleteDashboard() {
    confirmDialog(
        `Delete ${dashboardName.value} dashboard`,
        async () => {
            await window.axios.delete(apiRoute({ name: 'api_oee:user_dashboard.delete', params: { dashboardUuid: props.dashboard.uuid } }))
                .then(response => {
                    router.push({ name: 'oee.dashboard', query: { ddsb: props.dashboard.id } })
                    snackbar(response.data.message)
                })
        }
    )
}
</script>
