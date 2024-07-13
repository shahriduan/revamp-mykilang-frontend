import ConstantConfig from '@/config/ConstantConfig'

export default [
    {
        path: '/oee',
        meta: { auth: true, moduleCode: ConstantConfig.moduleCode.oee },
        component: () => import('@/layouts/oee/OEEDashboardLayout.vue'),
        redirect: { name: 'not_found' },
        children: [
            { 
                path: 'multi-site',
                component: () => import('@/views/oee/static-dashboard/multisite/MultiSitePage.vue'), 
                name: 'oee.dashboard'
            },
            { 
                path: 'factory-timeline', 
                component: () => import('@/views/oee/static-dashboard/factory-timeline/FactoryTimelinePage.vue'),
                name: 'oee.factory_timeline'
            },
            { 
                path: 'production-effectiveness', 
                component: () => import('@/views/oee/static-dashboard/production-effectiveness/EffectivenessChartPage.vue'), 
                name: 'oee.production_effectiveness'
            },
            { 
                path: 'oee-indicator', 
                component: () => import('@/views/oee/static-dashboard/oee-indicator/OEEIndicatorPage.vue'), 
                name: 'oee.indicator'
            },
            { 
                path: 'oee-batch', 
                component: () => import('@/views/oee/static-dashboard/batch-oee/BatchOEEPage.vue'), 
                name: 'oee.batch'
            },
            { 
                path: 'user-dashboard/:dashboardUuid', 
                component: () => import('@/views/oee/dynamic-dashboard/CustomDashboardPage.vue'), 
                name: 'oee.dashboard.custom'
            },
            { 
                path: 'production-raw-data', 
                component: () => import('@/views/oee/realtime-dashboard/production-raw-data/ProductionRawDataPage.vue'), 
                name: 'oee.production_raw_data'
            },
            { 
                path: 'live-operation', 
                component: () => import('@/views/oee/realtime-dashboard/live-operation/LiveOperationPage.vue'), 
                name: 'oee.live_operation'
            }
        ]
    }
]