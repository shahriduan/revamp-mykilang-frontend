export default [
    {
        path: '/socialite-auth/register-token',
        component: () => import('@/views/console/auth/SocialiteScreen.vue'),
        name: 'socialite_auth_register_token',
        meta: { auth: false }
    },
    {
        path: '/start-up',
        component: () => import('@/views/console/auth/AuthenticatingScreen.vue'),
        name: 'system_start',
        meta: { auth: true }
    },
    {
        path: '/email-verification',
        component: () => import('@/views/console/auth/EmailVerification.vue'),
        name: 'email_verification'
    },
    {
        path: '/logout',
        component: () => import('@/views/console/auth/LogoutScreen.vue'),
        name: 'logout',
        meta: { auth: true }
    },
    {
        meta: { auth: false },
        component: () => import('@/layouts/console/AuthLayout.vue'),
        redirect: { name: 'login' },
        children: [
            {
                path: '/',
                component: () => import('@/views/console/auth/LoginPage.vue'),
                name: 'login'
            },
            // {
            //     path: '/forgot-password',
            //     component: () => import('../Pages/Auth/ForgotPasswordPage.vue'),
            //     name: 'forgot_password'
            // },
            // {
            //     path: '/reset-password/:token',
            //     component: () => import('../Pages/Auth/ResetPasswordPage.vue'),
            //     name: 'reset_password'
            // },
        ]
    },
]