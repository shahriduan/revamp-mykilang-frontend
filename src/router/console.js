export default [
    {
        path: '/email-verification',
        component: () => import('@/views/console/auth/EmailVerification.vue'),
        name: 'email_verification'
    },

    /***** GUEST *****/
    {
        meta: { auth: false },
        children: [
            {
                path: '/socialite-auth/register-token',
                component: () => import('@/views/console/auth/SocialiteScreen.vue'),
                name: 'socialite_auth_register_token',
            },
            {
                path: '/',
                component: () => import('@/layouts/console/AuthLayout.vue'),
                redirect: { name: 'login' },
                children: [
                    {
                        path: '/',
                        component: () => import('@/views/console/auth/LoginPage.vue'),
                        name: 'login'
                    },
                    {
                        path: '/forgot-password',
                        component: () => import('@/views/console/auth/ForgotPasswordPage.vue'),
                        name: 'forgot_password'
                    },
                    {
                        path: '/reset-password/:token',
                        component: () => import('@/views/console/auth/ResetPasswordPage.vue'),
                        name: 'reset_password'
                    },
                ]
            },
        ]
    },

    /***** AUTHENTICATED *****/
    {
        meta: { auth: true },
        children: [
            {
                path: '/start-up',
                component: () => import('@/views/console/auth/AuthenticatingScreen.vue'),
                name: 'system_start',
            },
            {
                path: '/logout',
                component: () => import('@/views/console/auth/LogoutScreen.vue'),
                name: 'logout',
            },
            
            // Console Home
            {
                path: '/',
                component: () => import('@/layouts/console/ConsoleHomeLayout.vue'), 
                children: [
                    {
                        path: '/console-home',
                        component: () => import('@/views/console/console-home/ConsoleHomePage.vue'),
                        name: 'console_home'
                    },
                    {
                        path: '/subscribe-module/:module',
                        component: () => import('@/views/console/console-home/NotSubscribedPage.vue'),
                        name: 'subscribe_module'
                    },
                    {
                        path: '/platform-not-available',
                        component: () => import('@/views/console/console-home/ModulePlatformNotAvailablePage.vue'),
                        name: 'platform_not_available'
                    },
                    {
                        path: '/self-installation-guidelines',
                        component: () => import('@/views/console/self-installation/SelfInstallationPage.vue'),
                        name: 'self_installation'
                    }
                ]
            },
            
            // Account profile
            {
                path: '/account',
                component: () => import('@/layouts/console/AccountLayout.vue'),
                children: [
                    {
                        path: 'change-email',
                        component: () => import('@/views/console/account/ChangeEmailPage.vue'),
                        name: 'account.change_email'
                    },
                    {
                        path: 'change-password',
                        component: () => import('@/views/console/account/ChangePasswordPage.vue'),
                        name: 'account.change_password'
                    },
                    {
                        path: 'system-settings',
                        component: () => import('@/views/console/account/SystemSettingPage.vue'),
                        name: 'account.system_setting'
                    },
                    {
                        path: 'security-checks',
                        component: () => import('@/views/console/account/SecurityCheckPage.vue'),
                        name: 'account.security_check'
                    }
                ]
            },

            // User Management
            {
                path: '/user-management',
                component: () => import('@/layouts/console/UserManagementLayout.vue'),
                children: [
                    // User list
                    {
                        path: '/users',
                        component: () => import('@/views/console/user-management/user/UserListPage.vue'),
                        name: 'user.index',
                        meta: { permission: ['user.list'] }
                    },
                    {
                        path: '/user-management/user/form/:action/:user?',
                        component: () => import('@/views/console/user-management/user/UserFormPage.vue'),
                        name: 'user.form',
                        meta: { permission: ['user.add', 'user.edit'] }
                    },
                    {
                        path: '/user-management/user/delete/:user',
                        component: () => import('@/views/console/user-management/user/DeleteUserPage.vue'),
                        name: 'user.delete_user',
                        meta: { permission: ['user.delete'] }
                    },
                    {
                        path: '/user-management/reset-password/:user',
                        component: () => import('@/views/console/user-management/user/ResetPasswordPage.vue'),
                        name: 'user.reset_password',
                        meta: { permission: ['user.reset_password'] }
                    },

                    // Cloud Roles and Permissions
                    {
                        path: '/user-management/roles',
                        component: () => import('@/views/console/user-management/role-permission/RoleListPage.vue'),
                        name: 'role.index',
                        meta: { permission: ['role.list'] }
                    },
                    {
                        path: '/user-management/roles/form/:action/:role?',
                        component: () => import('@/views/console/user-management/role-permission/PermissionFormPage.vue'),
                        name: 'role.form',
                        meta: { permission: ['role.add', 'role.edit'] }
                    },

                    // On-premise Roles and Permissions
                    {
                        path: '/user-management/ot-roles',
                        component: () => import('@/views/console/user-management/role-permission/OTRoleListPage.vue'),
                        name: 'ot_role.index',
                        meta: { permission: ['role.list'] }
                    },
                    {
                        path: '/user-management/ot-roles/form/:action/:role?',
                        component: () => import('@/views/console/user-management/role-permission/OTPermissionFormPage.vue'),
                        name: 'ot_role.form',
                        meta: { permission: ['role.add', 'role.edit'] }
                    },
                ]
            },

            // My Company
            {
                path: '/',
                component: () => import('@/layouts/console/MyCompanyLayout.vue'),
                children: [
                    {
                        path: '/my-company',
                        component: () => import('@/views/console/company/MyCompanyPage.vue'),
                        name: 'my_company'
                    },

                    // Subsidiary
                    // {
                    //     path: '/subsidiary/list',
                    //     component: () => import('../Pages/Subsidiary/SubsidiaryListPage.vue'),
                    //     name: 'subsidiary.list',
                    //     meta: { permission: ['subsidiary.list'] }
                    // },
                    {
                        path: '/subsidiary/details/:action/:subsidiary?',
                        component: () => import('@/views/console/company/subsidiary/SubsidiaryFormPage.vue'),
                        name: 'subsidiary.form',
                        meta: { permission: ['company.manage_subsidiary'] }
                    },

                    // Factory
                    {
                        path: '/factory/list',
                        component: () => import('@/views/console/company/factory/FactoryListPage.vue'),
                        name: 'factory.list'
                    },
                    {
                        path: '/factory/details/:action/:factory?',
                        component: () => import('@/views/console/company/factory/FactoryFormPage.vue'),
                        name: 'factory.form',
                        meta: { permission: ['company.manage_factory'] }
                    },

                    // Settings
                    {
                        path: '/settings/working-days',
                        component: () => import('@/views/console/company/settings/WorkingDayPage.vue'),
                        name: 'working-days'
                    },
                    {
                        path: '/settings/holidays',
                        component: () => import('@/views/console/company/settings/HolidaysPage.vue'),
                        name: 'holidays'
                    },

                    // Licenses
                    {
                        path: '/client-account/license-keys',
                        component: () => import('@/views/console/company/license/LicenseKeyListPage.vue'),
                        name: 'license_key.index',
                        meta: { permission: ['license_key.view'] }
                    },
                    {
                        path: '/client-account/unpair-license-key/:license',
                        component: () => import('@/views/console/company/license/UnpairLicenseKeyFormPage.vue'),
                        name: 'unpair_license_key.form',
                        meta: { permission: ['license_key.unpair'] }
                    },
                ]
            },

            // {
            //     meta: { userType: 'HQ' },
            //     component: () => import('../Layouts/AppLayout.vue'),
            //     children: [
            //         {
            //             path: '/home',
            //             component: () => import('../Pages/Home/HomePage.vue'),
            //             name: 'home'
            //         },

            //         // Client Accounts
            //         {
            //             path: '/client-accounts',
            //             component: () => import('../Pages/ClientAccount/ClientAccountListPage.vue'),
            //             name: 'client_account.index',
            //             meta: { permission: ['client_account.list'] }
            //         },
            //         {
            //             path: '/client-account/form/account/:action/:company?',
            //             component: () => import('../Pages/ClientAccount/ClientAccountFormPage.vue'),
            //             name: 'client_account.form',
            //             meta: { permission: ['client_account.add', 'client_account.edit'] }
            //         },
            //         {
            //             path: '/client-account/form/module-subscriptions/:action/:company?',
            //             component: () => import('../Pages/ClientAccount/EditClientAccountModuleSubscriptionsForm.vue'),
            //             name: 'client_account.module_subscriptions.form',
            //             meta: { permission: ['client_account_module_subscriptions.edit'] }
            //         },
            //         {
            //             path: '/client-account/:company/license-keys',
            //             component: () => import('../Pages/Company/License/LicenseKeyListPage.vue'),
            //             name: 'client_account.license_key.index',
            //             meta: { permission: ['license_key.view'] }
            //         },
            //         {
            //             path: '/client-account/:company/license-key/form/:action/:license?',
            //             component: () => import('../Pages/Company/License/LicenseKeyFormPage.vue'),
            //             name: 'client_account.license_key.form',
            //             meta: { permission: ['license_key.add', 'license_key.edit'] }
            //         },
            //         {
            //             path: '/client-account/:company/unpair-license-key/form/:license',
            //             component: () => import('../Pages/Company/License/UnpairLicenseKeyFormPage.vue'),
            //             name: 'client_account.unpair_license_key.form',
            //             meta: { permission: ['license_key.unpair'] }
            //         },

            //         // Package
            //         {
            //             path: '/packages',
            //             component: () => import('../Pages/Package/PackageListPage.vue'),
            //             name: 'package.list',
            //             // meta: { permission: [] }
            //         },
            //         {
            //             path: '/package/:item',
            //             component: () => import('../Pages/Package/PackageFormPage.vue'),
            //             name: 'package.form',
            //         },

            //         // Access Client Module
            //         {
            //             path: '/access-client-module',
            //             component: () => import('../Pages/AccessClientModule/AccessClientModuleListPage.vue'),
            //             name: 'access_client_module.list',
            //         },

            //         // Module Configuration
            //         {
            //             path: '/system-modules',
            //             component: () => import('../Pages/ModuleConfiguration/ModuleListPage.vue'),
            //             name: 'system_module.index',
            //             meta: { permission: ['platform_settings.manage_module_configuration'] }
            //         },
            //         {
            //             path: '/system-module/:module',
            //             component: () => import('../Pages/ModuleConfiguration/ModuleConfiguration.vue'),
            //             name: 'system_module.config',
            //             meta: { permission: ['platform_settings.manage_module_configuration'] }
            //         },

            //         // Software
            //         {
            //             path: '/softwares',
            //             component: () => import('../Pages/Software/SoftwareListPage.vue'),
            //             name: 'software.index',
            //             meta: { permission: ['platform_settings.manage_software_version'] }
            //         },
            //         {
            //             path: '/software/:softwareId/version/:versionId?',
            //             component: () => import('../Pages/Software/SoftwareFormPage.vue'),
            //             name: 'software.form',
            //             meta: { permission: ['platform_settings.manage_software_version'] }
            //         },

            //         // Global Settings
            //         {
            //             path: '/global-setting',
            //             component: () => import('../Pages/GlobalSetting/GlobalSettingListPage.vue'),
            //             name: 'global_setting.index',
            //         },

            //         // User Session
            //         {
            //             path: '/user-session/active-sessions',
            //             component: () => import('../Pages/UserSession/ActiveSessionPage.vue'),
            //             name: 'user_session.active_sessions'
            //         },
            //     ]
            // },
        ]
    }
]
