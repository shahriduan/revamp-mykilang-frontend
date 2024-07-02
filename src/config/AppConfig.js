/*******************
 * Project Settings
 *******************
 * For white label purpose
 */
const defaultProject = import.meta.env.VITE_PROJECT

const project = {
    visi: {
        logo: '/img/logos/mykilang.png',
        logoWidth: '160', // px
    },

    tmone: {
        logo: '/img/logos/tmone.png',
        logoWidth: '100', // px
    }
}
 
/***************
 * Env Settings
 ***************/
const configAppEnv = import.meta.env.VITE_APP_ENV
const configdomain = import.meta.env.VITE_APP_URL
const configModuleDomain = import.meta.env.VITE_MODULE_API_URL
const configAppVersion = import.meta.env.VITE_APP_VERSION
const configAppName = import.meta.env.VITE_APP_NAME

/******************
 * System Settings
 ******************/
const configLogoutUrl = '/logout'
const configSystemLogo = Configdomain + project[defaultProject].logo
const configSystemLogoWidth = project[defaultProject].logoWidth
    
export default class AppConfig {
    static domain = () => configdomain
    static moduleDomain = () => configModuleDomain
    static systemLogo = () => configSystemLogo
    static logoutUrl = () => configLogoutUrl
    static systemLogoWidth = () => configSystemLogoWidth
    static appEnv = () => configAppEnv
    static appVersion = () => configAppVersion
    static appName = () => configAppName
    
}
