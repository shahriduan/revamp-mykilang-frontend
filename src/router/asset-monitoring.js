import ConstantConfig from '@/config/ConstantConfig'

export default [
    {
        path: '/asm',
        meta: { auth: true, moduleCode: ConstantConfig.moduleCode.asm },
        component: () => import('@/layouts/asset-monitoring/DashboardLayout.vue'),
        redirect: { name: 'not_found' },
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/asset-monitoring/DashboardPage.vue'),
                name: 'asm:dashboard'
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

            // //Dashboard
            {
                path: 'real-time',
                component: () => import('@/views/asset-monitoring/realtime/RealTimePage.vue'),
                name: 'asm:real_time'
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
]