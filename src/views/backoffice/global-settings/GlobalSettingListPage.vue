<template>
    <div class="mb-3">
        <x-content-header title="Global Settings" />
    </div>

    <div class="scroll-container scrollbar">
        <ul class="nav nav-tabs" id="myTab" role="tablist" ref="tabList">
            <li v-for="(category, index) in groupedSettings" :key="index" class="nav-item">
                <a class="nav-link" :class="{ 'active': index === 0 }" :id="'tab-' + index" data-bs-toggle="tab"
                    :href="'#tab-content-' + index" role="tab" :aria-controls="'#tab-content-' + index"
                    :aria-selected="index === 0">
                    {{ category.name }}
                </a>
            </li>
        </ul>
    </div>
    <div class="tab-content" id="myTabContent">
        <div v-for="(category, index) in groupedSettings" :key="index" class="tab-pane fade"
            :class="{ 'show active': index === 0 }" :id="'tab-content-' + index" role="tabpanel"
            :aria-labelledby="'tab-' + index">
            <CircleSpinner class="mt-4" v-if="contentLoader" />
            <div class="card mt-2" v-if="!contentLoader">
                <div class="card-body">
                    <div class="mb-2" v-for="setting in category.settings" :key="setting.id">
                        <label class="col-form-label" :for="'value-' + setting.id">{{ setting.description }}</label>
                        <input class="form-control w-md-50" :id="'value-' + setting.id" type="text"
                            v-model="setting.value" @input="handleChange(setting.id, setting.value)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-3">
        <button class="btn btn-primary" type="button" @click="saveSettings" :disabled="!hasChanges || buttonLoader">
            Save Changes
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { snackbar } from '@/components/Snackbar'
import apiRoute from '@/helpers/ApiHelper'
import CircleSpinner from '@/components/CircleSpinner.vue'

const globalList = ref([])
const groupedSettings = ref([])
const originalSettings = reactive({})
const changedSettings = reactive({})
const buttonLoader = ref(false)
const contentLoader = ref(true)
const hasChanges = ref(false)
const tabList = ref(null)

onMounted(async () => {
    contentLoader.value = true
    await getGlobalSettings()
    contentLoader.value = false
    await nextTick()
})

async function getGlobalSettings() {
    await window.axios.get(apiRoute({ name: 'api:global_settings.global_setting_list' }))
        .then(function (response) {
            globalList.value = response.data.data
            groupedSettingsByCategory()
            setOriginalValues()
        })
        .catch(function(error) {
            snackbar('Error in retrieving data!')
        })
}

function groupedSettingsByCategory() {
    const categories = {}
    globalList.value.forEach(setting => {
        if (!categories[setting.category]) {
            categories[setting.category] = []
        }
        categories[setting.category].push(setting)
    })

    groupedSettings.value = Object.keys(categories).map(category => ({
        name: category,
        settings: categories[category],
    }))
}

function setOriginalValues() {
    globalList.value.forEach(setting => {
        originalSettings[setting.id] = setting.value
    })
}

function handleChange(id, newValue) {
    if (originalSettings[id] !== newValue) {
        changedSettings[id] = newValue
    } else {
        delete changedSettings[id]
    }
    hasChanges.value = Object.keys(changedSettings).length > 0
}

async function saveSettings() {
    buttonLoader.value = true
    const requests = Object.keys(changedSettings).map(id => updateSetting(id, changedSettings[id]))

    try {
        await Promise.all(requests)
        snackbar('Settings updated successfully!')
        setOriginalValues()
        resetChanges()
    } catch (error) {
        snackbar('Error updating settings.')
    } finally {
        buttonLoader.value = false
    }
}

async function updateSetting(id, value) {
    await window.axios.post(apiRoute({ name: 'api:global_settings.submit_global_setting', params: { globalSetting: id } }), { value })
        .catch(function(error) {
            snackbar('Unexpected Error')
        })
}

function resetChanges() {
    for (const key in changedSettings) {
        delete changedSettings[key]
    }
    hasChanges.value = false
}
</script>

<style scoped>
.scroll-container {
  overflow: auto;
  white-space: nowrap;
  flex: 1;
}

ul.nav-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  margin-bottom: 0;
}

ul.nav-tabs .nav-item {
  flex: 0 0 auto;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  box-shadow: 10px; 
}
 
::-webkit-scrollbar-thumb {
  background: rgb(60, 60, 61); 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #a2a2a3; 
}
</style>