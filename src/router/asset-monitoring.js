import ConstantConfig from '@/config/ConstantConfig'

export default [
    {
        path: '/asm',
        meta: { auth: true, moduleCode: ConstantConfig.moduleCode.asm },
        component: () => import('@/layouts/asset-monitoring/MainDashboardLayout.vue'),
        redirect: { name: 'not_found' },
        children: [
            // Dashboard
            {
                path: 'dashboard',
                component: () => import('@/layouts/asset-monitoring/DashboardContentLayout.vue'),
                redirect: { name: 'not_found' },
                children: [
                    {
                        path: 'realtime',
                        component: () => import('@/views/asset-monitoring/realtime/RealTimePage.vue'),
                        name: 'asm:realtime'
                    },
                    {
                        path: 'temperature',
                        component: () => import('@/views/asset-monitoring/temperature/TemperaturePage.vue'),
                        name: 'asm:temperature'
                    },
                    {
                        path: 'vibration',
                        component: () => import('@/views/asset-monitoring/vibration/VibrationPage.vue'),
                        name: 'asm:vibration'
                    },
                    {
                        path: 'power-consumption',
                        component: () => import('@/views/asset-monitoring/power/PowerConsumptionPage.vue'),
                        name: 'asm:power_consumption'
                    },
                    {
                        path: 'analysis',
                        component: () => import('@/views/asset-monitoring/analysis/AnalysisPage.vue'),
                        name: 'asm:analysis'
                    }
                ]
            },

            // Manage
            {
                path: 'manage',
                component: () => import('@/views/asset-monitoring/ManagePage.vue'),
                name: 'asm:manage'
            },
            {
                path: 'asset',
                component: () => import('@/views/asset-monitoring/AssetPage.vue'),
                name: 'asm:asset'
            },
            {
                path: 'alarm-notification-settings',
                component: () => import('@/views/asset-monitoring/AlarmNotificationSettingPage.vue'),
                name: 'asm:alarm_settings'
            },
        ]
    },
]