import ConstantConfig from '@/config/ConstantConfig'

export default [
    {
        path: '/spc',
        meta: { auth: true, moduleCode: ConstantConfig.moduleCode.spc },
        component: () => import('@/layouts/supply-chain/DashboardLayout.vue'),
        redirect: { name: 'not_found' },
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/supply-chain/MainDashboardPage.vue'),
                name: 'spc:dashboard'
            },
            {
                path: 'warehouse',
                component: () => import('@/views/supply-chain/warehouse/WarehousePage.vue'),
                name: 'spc:warehouse'
            },
            {
                path: 'production',
                component: () => import('@/views/supply-chain/production/ProductionPage.vue'),
                name: 'spc:production'
            },
            {
                path: 'asset',
                component: () => import('@/views/supply-chain/asset/AssetPage.vue'),
                name: 'spc:asset'
            },
            {
                path: 'inventory',
                component: () => import('@/views/supply-chain/inventory/InventoryPage.vue'),
                name: 'spc:inventory'
            }
        ]
    }
]