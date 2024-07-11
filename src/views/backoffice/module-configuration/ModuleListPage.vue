<template>
    <x-content-header title="Modules" />

    <div class="row mt-1 g-3">
        <div class="col-lg-6" v-show="contentLoader" v-for="n in 2">
            <ModuleListPlaceholder />
        </div>
        <div class="col-lg-6" v-show="contentLoader == false" v-bind:key="index" v-for="(moduleData, index) in modules">
            <router-link :to="{ name: 'console:system_module.config', params: { module: moduleData.id } }" style="text-decoration: none">
                <div class="card border shadow-none h-100">
                    <div class="card-body p-4">
                        <div class="d-flex">
                            <div class="me-5 d-none d-md-block">
                                <img src="/img/icons/process.png" width="100" alt="Logo"  />
                            </div>
                            <div class="flex-grow-1">
                                <div class="card-title">{{ moduleData.module_name }}</div>
                                <p class="card-text">{{ moduleData.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { axiosGetModuleList } from '@/helpers/AxiosApiHelper'
import ModuleListPlaceholder from '@/views/backoffice/module-configuration/ModuleListPlaceholder.vue'

const contentLoader = ref(true)

const modules = ref([])

onMounted(async () => {
    await axiosGetModuleList((response) => {
        modules.value = response.data.data
    })

    contentLoader.value = false
})
</script>
