<template>
    <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">
        <div class="d-flex align-items-center">
            <div class="toggle-icon-wrapper">
                <button class="btn navbar-toggler-humburger-icon navbar-vertical-toggle" data-bs-toggle="tooltip" data-bs-placement="left" title="Toggle Navigation">
                    <span class="navbar-toggle-icon">
                        <span class="toggle-line"></span>
                    </span>
                </button>
            </div>
            <a class="navbar-brand" href="/">
                <div class="d-flex align-items-center py-3">
                    <img :src="AppConfig.systemLogo" :width="AppConfig.systemLogoWidth" alt="Logo" />
                </div>
            </a>
        </div>
        <div class="collapse navbar-collapse" id="navbarVerticalCollapse">
            <div class="navbar-vertical-content scrollbar">
                <ul class="navbar-nav flex-column mb-3" id="navbarVerticalNav">
                    <li class="nav-item">
                        <div class="mb-2">
                            <NavbarVerticalDivider>Static Dashboard</NavbarVerticalDivider>
                        </div>
                        <SidebarNavLink 
                            :is-active-nav="['oee.dashboard'].includes($route.name)" 
                            :route-name="{ name: 'oee.dashboard' }" 
                            title="Multi-Site">
                            <i class="fa-solid fa-industry"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['oee.factory_timeline'].includes($route.name)" 
                            :route-name="{ name: 'oee.factory_timeline' }" 
                            title="Factory Timeline">
                            <i class="fa-solid fa-timeline"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['oee.production_effectiveness'].includes($route.name)" 
                            :route-name="{ name: 'oee.production_effectiveness' }" 
                            title="Machine Effectiveness">
                            <i class="fa-solid fa-bars-staggered"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['oee.indicator'].includes($route.name)" 
                            :route-name="{ name: 'oee.indicator' }" 
                            title="OEE">
                            <i class="fa-solid fa-gauge-simple-high"></i>
                        </SidebarNavLink>
                        <SidebarNavLink 
                            :is-active-nav="['oee.batch'].includes($route.name)" 
                            :route-name="{ name: 'oee.batch' }" 
                            title="Batch OEE">
                            <i class="fa-solid fa-boxes"></i>
                        </SidebarNavLink>
                        <!-- <SidebarNavLink 
                            :is-active-nav="['production.batch'].includes($route.name)" 
                            :route-name="{ name: 'production.batch' }" 
                            title="Batch Production">
                            <i class="fa-solid fa-bar-chart"></i>
                        </SidebarNavLink> -->

                        <div class="mt-3 mb-2">
                            <NavbarVerticalDivider>Realtime Dashboard</NavbarVerticalDivider>
                        </div>
                        <!-- <SidebarNavLink 
                            :is-active-nav="['oee.production_raw_data'].includes($route.name)" 
                            :route-name="{ name: 'oee.production_raw_data' }" 
                            title="Production Raw Data">
                            <span class="fa-solid fa-table"></span>
                        </SidebarNavLink>     -->
                        <SidebarNavLink 
                            :is-active-nav="['oee.live_operation'].includes($route.name)" 
                            :route-name="{ name: 'oee.live_operation' }" 
                            title="Live Operation">
                            <i class="fa-solid fa-circle"></i>
                        </SidebarNavLink>   

                        <div class="mt-3 mb-2">
                            <NavbarVerticalDivider>Dynamic Dashboard</NavbarVerticalDivider>
                        </div>
                        <SidebarNavLink 
                            v-for="dashboard in dashboardData"
                            :key="dashboard.id"
                            :is-active-nav="$route.name == 'oee.dashboard.custom' && dashboard.uuid == $route.params.dashboardUuid" 
                            :route-name="{ name: 'oee.dashboard.custom', params: { dashboardUuid: dashboard.uuid } }" 
                            :title="dashboard.dashboard_name">
                            <span class="fa-solid fa-gauge"></span>
                        </SidebarNavLink>       
                        <button class="nav-link sidebar-menu" @click="addDashboard" role="button">
                            <div class="d-flex align-items-center">
                                <span class="nav-link-icon">
                                    <span class="fa-solid fa-plus" style="padding-right: 10px"></span>
                                </span>
                                <span class="nav-link-text">New</span>
                            </div>
                        </button>                    
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { snackbar } from '@/components/Snackbar'
import { loadingOverlay } from '@/components/LoadingOverlay'
import apiRoute from '@/helpers/ApiHelper'
import SidebarNavLink from '@/layouts/_shared/SidebarNavLink.vue'
import NavbarVerticalDivider from '@/layouts/_shared/NavbarVerticalDivider.vue'
import AppConfig from '@/config/AppConfig'

const props = defineProps(['refreshDashboardSidebar'])
const currentRoute = useRoute()
const router = useRouter()

const dashboardData = ref([])

onMounted(() => {
    getDashboards()
})

onUpdated(() => {
    handleUpdateDashboardSidebarName()
    handleDeleteDashboardSidebarName()
})

function handleDeleteDashboardSidebarName() {
    // ddsb = Delete Dashboard Sidebar
    if (currentRoute.query?.ddsb !== undefined) {
        const index = dashboardData.value.findIndex(item => item['id'] == currentRoute.query?.ddsb)

        if (index !== -1) {
            dashboardData.value.splice(index, 1)
        }

        setTimeout(() => router.push({ name: 'oee.dashboard' }), 500)
    }
}

function handleUpdateDashboardSidebarName() {
    // udsb = Update Dashboard Sidebar
    if (currentRoute.query?.udsb !== undefined) {
        var newDashboardName = currentRoute.query?.udsb
        var index = newDashboardName.indexOf('|');
        var updatedDashboardId = newDashboardName.substring(0, index) // Extract substring from start to index (exclusive)
        var updatedDashboardName = newDashboardName.substring(index + 1).trim() // Extract substring from index + 1 to end, then trim whitespace
        
        dashboardData.value.map((item) => {
            if (item.id == updatedDashboardId) {
                item['dashboard_name'] = updatedDashboardName                
            }
        })

        setTimeout(() => router.push({ name: 'oee.dashboard.custom' }), 500)
    }
}

async function getDashboards() {
    await window.axios.get(apiRoute({ name: 'api_oee:user_dashboard.list_dashboards' }))
        .then(function(response) {
            dashboardData.value = response.data.data
        })
}

async function addDashboard() {
    const defaultDashboardName = 'New Dashboard'
    
    loadingOverlay('show')

    await window.axios.post(apiRoute({ name: 'api_oee:user_dashboard.submit' }), {
            dashboard_name: defaultDashboardName
        })
        .then(async function(response) {
            await getDashboards()
            router.push({ name: 'oee.dashboard.custom', params: { dashboardUuid: response.data.data.uuid } })
        })
        .catch(function(error) {
            snackbar('Unexpected error: Unable to create new dashboard.')
        })

    loadingOverlay('hide')
}
</script>