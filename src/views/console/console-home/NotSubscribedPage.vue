<template>
    <div class="row mt-5">
        <div class="col-6  offset-3">
            <div class="card" v-if="loader">
                <div class="card-body">
                    <div class="h-100">
                        <div class="text-center p-4">
                            <h3 class="fw-normal my-0">{{ moduleData?.module_name }}</h3>
                            <p class="mt-3">{{ moduleData?.description }}</p>
                            <!-- <p>This module is not available on a Web platform. Only on</p> -->
                            <h5>Available on:</h5>
                            <ul class="list-unstyled">
                                <li class="border-bottom py-2" :class="{ 'text-300': moduleData.web_app_access == false }"> 
                                    <span class="fas fa-check" :class="{ 'text-primary': moduleData.web_app_access }"></span> Web App Platform
                                </li>
                                <li class="py-2" :class="{ 'text-300': moduleData.desktop_app_access == false }">
                                    <span class="fas fa-check" :class="{ 'text-primary': moduleData.desktop_app_access }"></span> Desktop App Platform
                                </li>
                            </ul>
                            <h2 class="fw-medium my-4"> 
                                <sup class="fw-normal fs-2 me-1">RM</sup>{{ moduleData?.base_price }}
                                <small class="fs--1 text-700">/ month</small>
                            </h2>
                            <!-- <a class="btn btn-outline-primary btn-lg" href="">Subscribe Now</a> -->
                            <router-link class="link-primary d-block mt-3" :to="{ name: 'console_home' }">
                                <i class="fa-solid fa-angle-left me-1 align-middle"></i>
                                Back to Console Home
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import apiRoute from '@/helpers/ApiHelper'

const currentRoute = useRoute()

const moduleData = ref(null)

const loader = ref(false)

onMounted(async () => {
    await window.axios.get(apiRoute({ name: 'api:platform_module.module_details', params: { module: currentRoute.params.module } }))
        .then(function(response) {
            moduleData.value = response.data.data
        })

    loader.value = true
})
</script>