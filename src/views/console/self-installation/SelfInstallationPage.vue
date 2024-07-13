<template>
    <div class="mb-3">
        <router-link :to="{ name: 'console_home' }" class="fw-semi-bold text-secondary fs-0" style="text-decoration: none">
            <span class="fa-solid fa-arrow-left me-2"></span> BACK TO CONSOLE HOME
        </router-link>
    </div>
    <div class="card">
        <div class="bg-holder d-none d-lg-block bg-card" style="background-image:url(/img/illustrations/corner-2.png);"></div>
        <div class="card-body position-relative">
            <h3>Welcome to MyKilang</h3>
            <p>Let's get started with the installation process of the software. Follow the simple steps below to seamlessly set up and begin using our powerful application.</p>
            <p>To get started, you'll need to install three essential pieces of software.</p>
            <ol>
                <li>Vsys Linx</li>
                <li>Vsys MyKilang</li>
                <li>Downtime Reporting System (DRS)</li>
            </ol>
        </div>
    </div>

    <div class="accordion card mt-3" id="accordion-vsyslinx" v-if="vsysLinx.name">
        <div class="accordion-item">
            <h2 class="accordion-header accordion-button collapsed fs-2" id="heading1" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1" style="cursor: pointer">
                Vsys Linx (Version {{ vsysLinx.version }})
            </h2>
            <div class="accordion-collapse collapse" id="collapse1" aria-labelledby="heading1" data-bs-parent="#accordion-vsyslinx">
                <div class="accordion-body">
                    <DownloadButton :software-link="vsysLinx.url" :software-name="vsysLinx.name" class="me-2"/>
                    <UserManualButton :manual-link="vsysLinx.user_manual" :software-name="vsysLinx.name" class="mt-1" />
                </div>
                <div class="card-body pt-0">
                    <h5>Notes :</h5>
                    <div class="bg-dark rounded-2 text-white py-1 px-2">
                        {{ vsysLinx.description }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="accordion card mt-3" id="vsys-mykilang" v-if="vsysMykilang.name">
        <div class="accordion-item">
            <h2 class="accordion-header accordion-button collapsed fs-2" id="heading2" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2" style="cursor: pointer">
                Vsys MyKilang (Version {{ vsysMykilang.version }})
            </h2>
            <div class="accordion-collapse collapse" id="collapse2" aria-labelledby="heading2" data-bs-parent="#vsys-mykilang">
                <div class="accordion-body">
                    <DownloadButton :software-link="vsysMykilang.url" :software-name="vsysMykilang.name" class="me-2" />
                    <UserManualButton :manual-link="vsysMykilang.user_manual" :software-name="vsysMykilang.name" class="mt-1" />
                </div>
                <div class="card-body pt-0">
                    <h5>Notes :</h5>
                    <div class="bg-dark rounded-2 text-white py-1 px-2">
                        {{ vsysMykilang.description }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="accordion card mt-3" id="vsys-drs" v-if="vsysDrs.name">
        <div class="accordion-item">
            <h2 class="accordion-header accordion-button collapsed fs-2" id="heading2" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3" style="cursor: pointer">
                Downtime Reporting System (DRS) (Version {{ vsysDrs.version }})
            </h2>
            <div class="accordion-collapse collapse" id="collapse3" aria-labelledby="heading2" data-bs-parent="#vsys-drs">
                <div class="accordion-body">
                    <DownloadButton :software-link="vsysDrs.url" :software-name="vsysDrs.name" class="me-2" />
                    <UserManualButton :manual-link="vsysDrs.user_manual" :software-name="vsysDrs.name" class="mt-1" />
                </div>
                <div class="card-body pt-0">
                    <h5>Notes :</h5>
                    <div class="bg-dark rounded-2 text-white py-1 px-2">
                        {{ vsysDrs.description }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import DownloadButton from '@/views/console/self-installation/DownloadButton.vue'
import UserManualButton from '@/views/console/self-installation/UserManualButton.vue'
import apiRoute from '@/helpers/ApiHelper'

const vsysLinx = reactive({ url: null, name: null })
const vsysDrs = reactive({ url: null, name: null })
const vsysMykilang = reactive({ url: null, name: null })

onMounted(async () => {
    await getSoftwareDetails()
})

async function getSoftwareDetails() {
    await window.axios.get(apiRoute({ name: 'api:software_details' }))
        .then(response => {
            vsysMykilang.name = response.data.data.vsys_mykilang?.name
            vsysMykilang.version = response.data.data.vsys_mykilang?.version
            vsysMykilang.url = response.data.data.vsys_mykilang?.url
            vsysMykilang.user_manual = response.data.data.vsys_mykilang?.user_manual
            vsysMykilang.description = response.data.data.vsys_mykilang?.description

            vsysLinx.name = response.data.data.vsys_linx?.name
            vsysLinx.version = response.data.data.vsys_linx?.version
            vsysLinx.url = response.data.data.vsys_linx?.url
            vsysLinx.user_manual = response.data.data.vsys_linx?.user_manual
            vsysLinx.description = response.data.data.vsys_linx?.description

            vsysDrs.name = response.data.data.vsys_drs?.name
            vsysDrs.version = response.data.data.vsys_drs?.version
            vsysDrs.url = response.data.data.vsys_drs?.url
            vsysDrs.user_manual = response.data.data.vsys_drs?.user_manual
            vsysDrs.description = response.data.data.vsys_drs?.description
        })
}
</script>