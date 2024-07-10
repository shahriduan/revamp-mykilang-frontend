<template>
    <x-content-header title="Factories" class="mb-3">
        <router-link :to="{ name: 'factory.form', params: { action: 'create' } }" class="btn btn-outline-dark" v-if="$can('company.manage_factory')">
            <i class="fas fa-plus me-1"></i> New Factory
        </router-link>
    </x-content-header>

    <CircleSpinner class="mt-5" v-if="contentLoader == true" />

    <div class="card mt-3" v-if="contentLoader == false">
        <div class="card-body px-0 pt-0 pb-1">
            <div class="table-responsive">
                <table class="table table-sm mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th class="fw-bolder">Name</th>
                            <th class="fw-bolder">Factory ID</th>
                            <th class="fw-bolder">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="factory in factories" v-if="factories.length > 0">
                            <td>
                                <router-link :to="{ name: 'factory.form', params: { action: 'edit', factory: factory.id } }" style="text-decoration: none">
                                    {{ factory.name }}
                                </router-link>
                            </td>
                            <td>
                                <div>
                                    {{ factory.uuid }}
                                    <span @click="copyFactoryUniqueId(factory.id, factory.uuid)" style="cursor: pointer;">
                                        <i class="fa-copy ms-3 me-1" :class="[copyUuid[factory.id].icon]"></i>
                                        <span>{{ copyUuid[factory.id].text }}</span>
                                    </span>
                                </div>
                            </td>
                            <td class="center-text">
                                <span class="badge badge-subtle-success" v-if="factory.status == true">Active</span>
                                <span class="badge badge-subtle-danger" v-else>Inactive</span>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="6" class="text-center">No record found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import CircleSpinner from '@/components/CircleSpinner.vue'
import apiRoute from '@/helpers/ApiHelper'

const contentLoader = ref(false)
const factories = ref([])
const search = ref('')
const status = ref('')
const copyUuid = ref([])
const { copy } = useClipboard()

onMounted(async () => {
    contentLoader.value = true
    await getFactories()
    contentLoader.value = false
})

function copyFactoryUniqueId(factory_id, factory_uuid) {
    copyUuid.value[factory_id].text = 'Copied'
    copyUuid.value[factory_id].icon = 'fa-solid'

    copy(factory_uuid);

    setTimeout(() => {
        copyUuid.value[factory_id].text = 'Copy'
        copyUuid.value[factory_id].icon = 'fa-regular'
    }, 1500)
}

async function getFactories() {
    await window.axios.get(apiRoute({ name: 'api:factory.list', query: { search: search.value, status: status.value } }))
        .then(function(response) {
            factories.value = response.data.data.map((value, key) => {
                copyUuid.value[value.id] = { 'text': 'Copy', 'icon': 'fa-regular' }
                return value
            })
        })
}
</script>
