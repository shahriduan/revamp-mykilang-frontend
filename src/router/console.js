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
                name: 'console:system_start',
            },
            {
                path: '/logout',
                component: () => import('@/views/console/auth/LogoutScreen.vue'),
                name: 'console:logout',
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
                        name: 'console:subscribe_module'
                    },
                    {
                        path: '/platform-not-available',
                        component: () => import('@/views/console/console-home/ModulePlatformNotAvailablePage.vue'),
                        name: 'console:platform_not_available'
                    },
                    {
                        path: '/self-installation-guidelines',
                        component: () => import('@/views/console/self-installation/SelfInstallationPage.vue'),
                        name: 'console:self_installation'
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
                        name: 'console:account.change_email'
                    },
                    {
                        path: 'change-password',
                        component: () => import('@/views/console/account/ChangePasswordPage.vue'),
                        name: 'console:account.change_password'
                    },
                    {
                        path: 'system-settings',
                        component: () => import('@/views/console/account/SystemSettingPage.vue'),
                        name: 'console:account.system_setting'
                    },
                    {
                        path: 'security-checks',
                        component: () => import('@/views/console/account/SecurityCheckPage.vue'),
                        name: 'console:account.security_check'
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
                        name: 'console:user.index',
                        meta: { permission: ['user.list'] }
                    },
                    {
                        path: '/user-management/user/form/:action/:user?',
                        component: () => import('@/views/console/user-management/user/UserFormPage.vue'),
                        name: 'console:user.form',
                        meta: { permission: ['user.add', 'user.edit'] }
                    },
                    {
                        path: '/user-management/user/delete/:user',
                        component: () => import('@/views/console/user-management/user/DeleteUserPage.vue'),
                        name: 'console:user.delete_user',
                        meta: { permission: ['user.delete'] }
                    },
                    {
                        path: '/user-management/reset-password/:user',
                        component: () => import('@/views/console/user-management/user/ResetPasswordPage.vue'),
                        name: 'console:user.reset_password',
                        meta: { permission: ['user.reset_password'] }
                    },

                    // Cloud Roles and Permissions
                    {
                        path: '/user-management/roles',
                        component: () => import('@/views/console/user-management/role-permission/RoleListPage.vue'),
                        name: 'console:role.index',
                        meta: { permission: ['role.list'] }
                    },
                    {
                        path: '/user-management/roles/form/:action/:role?',
                        component: () => import('@/views/console/user-management/role-permission/PermissionFormPage.vue'),
                        name: 'console:role.form',
                        meta: { permission: ['role.add', 'role.edit'] }
                    },

                    // On-premise Roles and Permissions
                    {
                        path: '/user-management/ot-roles',
                        component: () => import('@/views/console/user-management/role-permission/OTRoleListPage.vue'),
                        name: 'console:ot_role.index',
                        meta: { permission: ['role.list'] }
                    },
                    {
                        path: '/user-management/ot-roles/form/:action/:role?',
                        component: () => import('@/views/console/user-management/role-permission/OTPermissionFormPage.vue'),
                        name: 'console:ot_role.form',
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
                        name: 'console:my_company'
                    },

                    // Subsidiary
                    {
                        path: '/subsidiary/details/:action/:subsidiary?',
                        component: () => import('@/views/console/company/subsidiary/SubsidiaryFormPage.vue'),
                        name: 'console:subsidiary.form',
                        meta: { permission: ['company.manage_subsidiary'] }
                    },

                    // Factory
                    {
                        path: '/factory/list',
                        component: () => import('@/views/console/company/factory/FactoryListPage.vue'),
                        name: 'console:factory.list'
                    },
                    {
                        path: '/factory/details/:action/:factory?',
                        component: () => import('@/views/console/company/factory/FactoryFormPage.vue'),
                        name: 'console:factory.form',
                        meta: { permission: ['company.manage_factory'] }
                    },

                    // Settings
                    {
                        path: '/settings/working-days',
                        component: () => import('@/views/console/company/settings/WorkingDayPage.vue'),
                        name: 'console:working_days'
                    },
                    {
                        path: '/settings/holidays',
                        component: () => import('@/views/console/company/settings/HolidaysPage.vue'),
                        name: 'console:holidays'
                    },

                    // Licenses
                    {
                        path: '/client-account/license-keys',
                        component: () => import('@/views/console/company/license/LicenseKeyListPage.vue'),
                        name: 'console:license_key.index',
                        meta: { permission: ['license_key.view'] }
                    },
                    {
                        path: '/client-account/unpair-license-key/:license',
                        component: () => import('@/views/console/company/license/UnpairLicenseKeyFormPage.vue'),
                        name: 'console:unpair_license_key.form',
                        meta: { permission: ['license_key.unpair'] }
                    },
                ]
            },

            // Platform Owner
            {
                path: '/backoffice',
                meta: { userType: 'HQ' },
                component: () => import('@/layouts/console/BackofficeLayout.vue'),
                children: [
                    {
                        path: 'home',
                        component: () => import('@/views/backoffice/home/HomePage.vue'),
                        name: 'backoffice:home'
                    },

                    // Client Accounts
                    {
                        path: 'client-accounts',
                        component: () => import('@/views/backoffice/client-account/ClientAccountListPage.vue'),
                        name: 'console:client_account.index',
                        meta: { permission: ['client_account.list'] }
                    },
                    {
                        path: 'client-account/form/account/:action/:company?',
                        component: () => import('@/views/backoffice/client-account/ClientAccountFormPage.vue'),
                        name: 'console:client_account.form',
                        meta: { permission: ['client_account.add', 'client_account.edit'] }
                    },
                    {
                        path: 'client-account/form/module-subscriptions/:action/:company?',
                        component: () => import('@/views/backoffice/client-account/EditClientAccountModuleSubscriptionsForm.vue'),
                        name: 'console:client_account.module_subscriptions.form',
                        meta: { permission: ['client_account_module_subscriptions.edit'] }
                    },
                    {
                        path: 'client-account/:company/license-keys',
                        component: () => import('@/views/console/company/license/LicenseKeyListPage.vue'),
                        name: 'console:client_account.license_key.index',
                        meta: { permission: ['license_key.view'] }
                    },
                    {
                        path: 'client-account/:company/license-key/form/:action/:license?',
                        component: () => import('@/views/console/company/license/LicenseKeyFormPage.vue'),
                        name: 'console:client_account.license_key.form',
                        meta: { permission: ['license_key.add', 'license_key.edit'] }
                    },
                    {
                        path: 'client-account/:company/unpair-license-key/form/:license',
                        component: () => import('@/views/console/company/license/UnpairLicenseKeyFormPage.vue'),
                        name: 'console:client_account.unpair_license_key.form',
                        meta: { permission: ['license_key.unpair'] }
                    },

                    // Package
                    {
                        path: 'packages',
                        component: () => import('@/views/backoffice/package/PackageListPage.vue'),
                        name: 'console:package.list',
                        // meta: { permission: [] }
                    },
                    {
                        path: 'package/:item',
                        component: () => import('@/views/backoffice/package/PackageFormPage.vue'),
                        name: 'console:package.form',
                    },

                    // Access Client Module
                    {
                        path: 'access-client-module',
                        component: () => import('@/views/backoffice/client-module-access/AccessClientModuleListPage.vue'),
                        name: 'console:access_client_module.list',
                    },

                    // Module Configuration
                    {
                        path: 'system-modules',
                        component: () => import('@/views/backoffice/module-configuration/ModuleListPage.vue'),
                        name: 'console:system_module.index',
                        meta: { permission: ['platform_settings.manage_module_configuration'] }
                    },
                    {
                        path: 'system-module/:module',
                        component: () => import('@/views/backoffice/module-configuration/ModuleConfiguration.vue'),
                        name: 'console:system_module.config',
                        meta: { permission: ['platform_settings.manage_module_configuration'] }
                    },

                    // Software
                    {
                        path: 'softwares',
                        component: () => import('@/views/backoffice/software/SoftwareListPage.vue'),
                        name: 'console:software.index',
                        meta: { permission: ['platform_settings.manage_software_version'] }
                    },
                    {
                        path: 'software/:softwareId/version/:versionId?',
                        component: () => import('@/views/backoffice/software/SoftwareFormPage.vue'),
                        name: 'console:software.form',
                        meta: { permission: ['platform_settings.manage_software_version'] }
                    },

                    // Global Settings
                    {
                        path: 'global-setting',
                        component: () => import('@/views/backoffice/global-settings/GlobalSettingListPage.vue'),
                        name: 'console:global_setting.index',
                    },

                    // User Session
                    {
                        path: 'user-session/active-sessions',
                        component: () => import('@/views/backoffice/user-session/ActiveSessionPage.vue'),
                        name: 'console:user_session.active_sessions'
                    }
                ]
            }
        ]
    }
]
