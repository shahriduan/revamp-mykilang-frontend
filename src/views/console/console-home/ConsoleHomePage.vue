<template>
    <h3>Console Home</h3>
    <div>
        <div class="d-flex mb-3 mt-3">
            <div class="col">
                <h5 class="mb-0 text-default position-relative">
                    <span class="bg-200 dark__bg-1100 pe-3">Modules & Services</span>
                    <span class="border position-absolute top-50 w-100 start-0 z-n1"></span>
                </h5>
            </div>
            <div class="dropdown">
                <button class="btn btn-falcon-default dropdown-toggle" id="dropdownMenuButton" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{ moduleFilter }}
                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#" @click="filterModule('ALL')">All Modules</a>
                        <a class="dropdown-item" href="#" @click="filterModule('SUBSCRIBE')">Subscribed</a>
                    </div>
                </button>
            </div>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-4 text-center" v-for="n in 2" v-if="contentLoader">
                <div class="card h-100 cursor-pointer">
                    <div class="card-img-top mt-2">
                        <img class="img-medium" src="/img/illustrations/data-management.png" />
                    </div>
                    <div class="card-body placeholder-wave">
                        <h5 class="card-title text-center placeholder col-12 placeholder-lg"></h5>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3" v-for="platformModule in displayModules" v-if="contentLoader == false">
                <ModuleServiceCard
                    :module-name="platformModule.module_name"
                    module-package="Starter Package"
                    :is-subscribed="platformModule.is_subscribed == 1 ? true : false"
                    :description="platformModule.description"
                    @click="moduleRedirect(platformModule.redirect_url, platformModule.is_subscribed == 1 ? true : false, platformModule.web_app_access, AppConfig.moduleDomain, platformModule.code)"
                />
            </div>
        </div>
    </div>

    <div>
        <div class="d-flex mb-4 mt-3">
            <div class="col">
                <h5 class="mb-0 text-default position-relative">
                    <span class="bg-200 dark__bg-1100 pe-3">Management</span>
                    <span class="border position-absolute top-50 translate-middle-y w-100 start-0 z-n1"></span>
                </h5>
            </div>
        </div>
        <div class="tab-content">
            <div class="tab-pane preview-tab-pane active" role="tabpanel"
                aria-labelledby="tab-dom-5bd41722-f7d8-4c91-99db-7563e1ab6e6a"
                id="dom-5bd41722-f7d8-4c91-99db-7563e1ab6e6a">
                <div class="row g-3">
                    <!-- <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-4 text-center">
                        <div class="card border h-100 border-dark">
                            <div class="card-img-top"><img class="img-medium" src="/img/illustrations/bill.png"
                                    alt="" />
                            </div>
                            <div class="card-body">
                                <h5 class="card-title text-center">Billing & Payment</h5>
                            </div>
                        </div>
                    </div> -->
                    <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-4 text-center" v-if="$can(['user.list', 'role.list'])">
                        <router-link :to="$can('user.list') ? { name: 'console:user.index' } : { name: 'console:role.index' }" style="text-decoration: none">
                            <div class="card border shadow-none h-100">
                                <div class="card-img-top mt-2">
                                    <img class="img-medium" src="/img/illustrations/management.png" />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title text-center">User Management</h5>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-4 text-center">
                        <div class="card border shadow-none h-100">
                            <router-link :to="{ name: 'console:my_company' }" style="text-decoration: none">
                                <div class="card-img-top mt-2">
                                    <img class="img-medium" src="/img/illustrations/location-pin.png" alt="Company" />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title text-center">My Company</h5>
                                </div>
                            </router-link>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-4 text-center">
                        <div class="card border shadow-none h-100">
                            <router-link :to="{ name: 'console:self_installation' }" style="text-decoration: none">
                                <div class="card-img-top mt-2">
                                    <img class="img-medium" src="/img/illustrations/easy-installation.png" alt="Guidelines" />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title text-center">Self Installation Guidelines</h5>
                                </div>
                            </router-link>
                        </div>
                    </div>
                    <!-- <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-4 text-center">
                        <div class="card border h-100 border-dark">
                            <div class="card-img-top"><img class="img-medium"
                                    src="/img/illustrations/live-chat.png" alt="" /></div>
                            <div class="card-body">
                                <h5 class="card-title text-center">Support Chat</h5>
                            </div>
                        </div>
                    </div> -->
                    <!-- <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-4 text-center">
                        <div class="card border h-100 border-dark">
                            <div class="card-img-top"><img class="img-medium"
                                    src="/img/illustrations/knowledge.png" alt="" /></div>
                            <div class="card-body">
                                <h5 class="card-title text-center">Knowledge Base</h5>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { axiosGetModuleList } from '@/helpers/AxiosApiHelper'
import { loadingOverlay } from '@/components/LoadingOverlay'
import { snackbar } from '@/components/Snackbar'
import { useRouter } from 'vue-router'
import apiRoute from '@/helpers/ApiHelper'
import AppConfig from '@/config/AppConfig'
import ConstantConfig from '@/config/ConstantConfig'
import ModuleServiceCard from '@/views/console/console-home/ModuleServiceCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const contentLoader = ref(true)

const moduleFilter = ref('All Modules') // Filter text
const subscribedModules = ref([]) // List subscribed module
const allModules = ref([]) // List all modules
const displayModules = ref([]) // List module that will display in list card

onMounted(async () => {
    await getSubscribedModules()

    await axiosGetModuleList((callback) => {
        allModules.value = callback.data.data.map((item) => {
            item['is_subscribed'] = subscribedModules.value.includes(item.code) ? 1 : 2;

            if (item['is_subscribed'] == 1) {
                if (item.web_app_access == true) {
                    var redirect_url = AppConfig.moduleDomain + item.main_landing_url
                } else {
                    var redirect_url = router.resolve({ name: 'console:platform_not_available', query: { module: item.module_name } })
                }
            } else {
                var redirect_url = router.resolve({ name: 'console:subscribe_module', params: { module: item.id } })
            }

            item['redirect_url'] = redirect_url

            return item
        }).sort((a, b) => a.is_subscribed - b.is_subscribed)

        displayModules.value = allModules.value
    })

    contentLoader.value = false
})

function filterModule(filter) {
    if (filter == 'ALL') {
        moduleFilter.value = 'All Modules'
        displayModules.value = allModules.value
    } else {
        moduleFilter.value = 'Subscribed'
        displayModules.value = allModules.value.filter(item => item.is_subscribed == 1)
    }
}

async function getSubscribedModules() {
    await window.axios.get(apiRoute({ name: 'api:company.subscribed_module' }))
        .then(function(response) {
            subscribedModules.value = response.data.data.map(object => object.code);
        })
}

async function moduleRedirect(url, isSubscribed = false, haveWebAppAccess = false, moduleDomain, moduleCode) {
    // Pass local storage data to module
    var user_profile = localStorage.getItem(ConstantConfig.localStorageKey.userProfile)
    var token = authStore.token
    var theme = localStorage.getItem(ConstantConfig.localStorageKey.theme)

    if (isSubscribed == true) {
        if (haveWebAppAccess == true) {
            var auth_url = url + '?module=' + moduleCode + '&token=' + token + '&theme=' + theme + '&userProfile=' + user_profile

            await window.axios.post(apiRoute({ name: 'api:update_auth_module' }), {
                    current_domain: moduleDomain
                })
                .then(function(response) {
                    if (response.data.status == true) {
                        window.location.href = auth_url // Redirect to other module domain
                    }
                })
                .catch(function(error) {
                    snackbar('Unexpected error: Unable redirect access module')
                })
        } else {
            router.push({ name: url.name, query: { module: url.query.module } }) // Redirect to cannot access module from web app platform page
        }
    } else {
        router.push({ name: url.name, params: { module: url.params.module } }) // Redirect to subscribe page
    }
}
</script>

<style scoped>
.img-medium {
    max-width: 100px;
}
.card-img-top {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
