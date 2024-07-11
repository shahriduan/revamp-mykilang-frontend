export default [
    {
        path: '/apiw',
        meta: { auth: true, moduleCode: ConstantHelper.moduleCode.apiw },
        // component: () => import('../Layouts/APIWLayout/APIWLayout.vue'),
        // redirect: { name: 'not_found' },
        // children: [
        //     {
        //         path: 'dashboard',
        //         component: () => import('../Pages/APIWModule/MainDashboardPage.vue'),
        //         name: 'apiw.dashboard'
        //     },
        //     {
        //         path: 'warehouse',
        //         component: () => import('../Pages/APIWModule/Warehouse/WarehousePage.vue'),
        //         name: 'apiw.warehouse'
        //     },
        //     {
        //         path: 'production',
        //         component: () => import('../Pages/APIWModule/Production/ProductionPage.vue'),
        //         name: 'apiw.production'
        //     },
        //     {
        //         path: 'asset',
        //         component: () => import('../Pages/APIWModule/Asset/AssetPage.vue'),
        //         name: 'apiw.asset'
        //     },
        //     {
        //         path: 'inventory',
        //         component: () => import('../Pages/APIWModule/Inventory/InventoryPage.vue'),
        //         name: 'apiw.inventory'
        //     },
        // ]
    }
]