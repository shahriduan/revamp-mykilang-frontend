import { createRouter, createWebHistory } from 'vue-router'
import AppConfig from '@/config/AppConfig'

const apiRoute = createRouter({
    history: createWebHistory(),
    routes: [
        {
            meta: { domain: AppConfig.consoleDomain },
            path: '/api',
            children: [
                /* CONSOLE */
                // Auth
                { path: 'authenticate', name: 'api:auth' },
                { path: 'update-auth-module', name: 'api:update_auth_module' },
                { path: 'socialite-auth/redirect/:provider', name: 'api:socialite_auth_redirect' },
                { path: 'user-profile', name: 'api:user_profile' },
                { path: 'forgot-password', name: 'api:forgot_password' },
                { path: 'reset-password', name: 'api:reset_password' },
                { path: 'logout', name: 'api:logout' },

                // General
                { path: 'get-states', name: 'api:get_state' },
                { path: 'get-timezones', name: 'api:get_timezones' },

                // Account
                { path: 'account/update-password', name: 'api:account.update_password' },
                { path: 'account/verify-current-email', name: 'api:account.verify_current_email' },
                { path: 'account/change-new-email', name: 'api:account.change_new_email' },
                { path: 'account/active-sessions', name: 'api:account.get_active_session' },
                { path: 'account/terminate-session', name: 'api:account.terminate_session' },
                { path: 'account/get-user-settings', name: 'api:account.user_settings' },
                { path: 'account/submit-user-settings', name: 'api:account.submit_user_settings' },

                // Client Account
                { path: 'client-account/client-account-list', name: 'api:client_account.client_list'},
                { path: 'client-account/submit-account/:action/:company?', name: 'api:client_account.submit_account' },
                { path: 'client-account/get-client-account/:company', name: 'api:client_account.account_details' },
                { path: 'client-account/upload-logo', name: 'api:client_account.upload_logo' },

                // Company Profile
                { path: 'company/subscribed-package/:company?', name: 'api:company.subscribed_package' },
                { path: 'company/subscribed-modules/:company?', name: 'api:company.subscribed_module' },
                { path: 'company/get-licenses/:company?', name: 'api:company.license_list' },
                { path: 'company/get-license/:license', name: 'api:company.license_details' },
                { path: 'company/submit-license/:action/:license?', name: 'api:company.submit_license' },
                { path: 'company/submit-unpair-license', name: 'api:company.unpair_submit_license' },

                // Company - Setting
                { path: 'company/get-working-days/:company?', name: 'api:company.get_working_day' },
                { path: 'company/submit-working-day', name: 'api:company.submit_working_day'},
                { path: 'company/submit-new-holiday', name: 'api:company.submit_new_holiday'},
                { path: 'company/get-holidays/:company?', name: 'api:company.get_holiday'},
                { path: 'company/delete-holiday', name: 'api:company.delete_holiday'},
                { path: 'company/edit-holiday', name: 'api:company.edit_holiday'},

                // User Management - User
                { path: 'user-management/get-users', name: 'api:user_management.user_list' },
                { path: 'user-management/get-user-list/:company?', name: 'api:user_management.list_user_company' },
                { path: 'user-management/get-user/:user', name: 'api:user_management.user_details' },
                { path: 'user-management/submit-user/:action/:user?', name: 'api:user_management.submit_user' },
                { path: 'user-management/delete-user/:user', name: 'api:user_management.delete_user' },
                { path: 'user-management/reset-password/:user', name: 'api:user_management.reset_password' },

                // User Management - IT Role and Permission
                { path: 'user-management/it/get-roles', name: 'api:user_management.role_list' },
                { path: 'user-management/it/get-role/:role', name: 'api:user_management.role_details' },
                { path: 'user-management/it/list-user-not-in-role/:role', name: 'api:user_management.list_user_not_in_role' },
                { path: 'user-management/it/assign-user-role', name: 'api:user_management.assign_user_role' },
                { path: 'user-management/it/get-permissions', name: 'api:user_management.permission_list' },
                { path: 'user-management/it/submit-role-permission/:action/:role?', name: 'api:user_management.submit_role_permission' },
                { path: 'user-management/it/delete-role/:role', name: 'api:user_management.delete_role' },

                // User Management - OT Role and Permission
                { path: 'user-management/ot/get-roles', name: 'api:user_management.ot_role_list' },
                { path: 'user-management/ot/get-role/:role', name: 'api:user_management.ot_role_details' },
                { path: 'user-management/ot/get-permissions', name: 'api:user_management.ot_permission_list' },
                { path: 'user-management/ot/submit-role-permission/:action/:role?', name: 'api:user_management.submit_ot_role_permission' },
                { path: 'user-management/ot/delete-role/:role', name: 'api:user_management.delete_ot_role' },

                // Package Settings
                { path: 'package/get-packages', name: 'api:package.list' },
                { path: 'package/get-package/:item', name: 'api:package.details' },
                { path: 'package/update-package/:item', name: 'api:package.update' },

                // Module Configuration
                { path: 'module/get-modules', name: 'api:platform_module.module_list' },
                { path: 'module/get-module/:module', name: 'api:platform_module.module_details' },
                { path: 'module/update-module/:module', name: 'api:platform_module.update_module' },

                // Company - Subsidiary
                { path: 'company/get-subsidiaries/:company?', name: 'api:subsidiary.list' },
                { path: 'company/get-subsidiary/:subsidiary', name: 'api:subsidiary.details'},
                { path: 'company/submit-subsidiary/:action/:subsidiary?', name: 'api:company.submit_subsidiary'},

                // Company - Factory
                { path: 'company/get-factories/:company?', name: 'api:factory.list' },
                { path: 'company/get-factory/:factory', name: 'api:factory.details' },
                { path: 'company/submit-factory/:action/:factory?', name: 'api:factory.submit' },

                // Software
                { path: 'software/client-downloadable', name: 'api:software_details' },
                { path: 'software/list', name: 'api:software.list' },
                { path: 'software/version-details/:softwareVersionId', name: 'api:software.version_details' },
                { path: 'software/submit-version/:softwareId/:action/:softwareVersionId?', name: 'api:software.submit_version' },

                //Global Settings
                { path: 'global-setting/list', name: 'api:global_settings.global_setting_list' },
                { path: 'global-setting/submit/:globalSetting', name: 'api:global_settings.submit_global_setting' },

                //User Session
                { path: 'access-token/get-all-active-sessions', name: 'api:user_session.user_active_session_list' },
                { path: 'access-token/kill-sessions', name: 'api:user_session.submit_terminate_active_user' },
                /* CONSOLE */
            ]
        },
        {
            meta: { domain: AppConfig.moduleDomain },
            path: '/api',  
            children: [
                /* OEE MODULE */
                // Access data
                { path: 'user-access/get-user-production-line', name: 'api:user_access.production_line_list' },
                { path: 'user-access/get-user-part', name: 'api:user_access.part_list' },
                { path: 'user-access/get-user-shift', name: 'api:user_access.shift_list' },
                { path: 'user-access/get-user-machine', name: 'api:user_access.machine_list' },

                // Static dashboard
                { path: 'oee/static-dashboard/get-multisite-oee', name: 'api_oee:default_dashboard.dashboard_oee' },
                { path: 'oee/static-dashboard/get-oee-indicator', name: 'api_oee:default_dashboard.production_line_oee' },
                { path: 'oee/static-dashboard/get-effectiveness-chart', name: 'api_oee:default_dashboard.effectiveness_chart' },
                { path: 'oee/static-dashboard/get-factory-timeline', name: 'api_oee:default_dashboard.factory_timeline' },
                { path: 'oee/static-dashboard/get-batch-oee', name: 'api_oee:default_dashboard.batch_oee' },

                // Dynamic dashboard
                { path: 'oee/dynamic-dashboard/get-dashboards', name: 'api_oee:user_dashboard.list_dashboards' },
                { path: 'oee/dynamic-dashboard/get-dashboard/:dashboardUuid', name: 'api_oee:user_dashboard.dashboard_details' },
                { path: 'oee/dynamic-dashboard/submit-dashboard/:dashboardUuid?', name: 'api_oee:user_dashboard.submit' },
                { path: 'oee/dynamic-dashboard/delete-dashboard/:dashboardUuid?', name: 'api_oee:user_dashboard.delete' },
                { path: 'oee/dynamic-dashboard/get-dashboard-widgets/:dashboardUuid', name: 'api_oee:user_dashboard.get_dashboard_widgets' },
                { path: 'oee/dynamic-dashboard/submit-dashboard-widget/:dashboardUuid/:dashboardWidget?', name: 'api_oee:user_dashboard.submit_dashboard_widget' },
                { path: 'oee/dynamic-dashboard/delete-dashboard-widget/:dashboardWidget', name: 'api_oee:user_dashboard.delete_dashboard_widget' },
                { path: 'oee/dynamic-dashboard/reorder-widget/:dashboardWidget', name: 'api_oee:user_dashboard.reorder_widget' },
                { path: 'oee/dynamic-dashboard/change-widget-date/:dashboardWidget', name: 'api_oee:user_dashboard.change_widget_date' },

                // Realtime dashboard
                { path: 'oee/realtime-dashboard/raw-oee', name: 'api_oee:raw_oee' },
                { path: 'oee/realtime-dashboard/live-operation', name: 'api_oee:live_operation' },

                { path: 'oee/widget/widget-types', name: 'api_oee:user_dashboard.widget_types' },
                /* OEE MODULE */

                /* SUPPLY CHAIN MODULE */
                { path: 'basic-module/get-assets', name: 'api_spc:get_assets' },
                { path: 'basic-module/get-inventories', name: 'api_spc:get_inventories' },
                { path: 'basic-module/get-productions', name: 'api_spc:get_productions' },
                { path: 'basic-module/get-warehouse-stocks', name: 'api_spc:get_warehouse_stocks' },
                /* SUPPLY CHAIN MODULE */
            ]
        }
    ]
})

export default apiRoute
