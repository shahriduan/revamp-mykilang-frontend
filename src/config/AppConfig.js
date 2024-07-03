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
const configDomain = import.meta.env.VITE_APP_URL
const configConsoleDomain = import.meta.env.VITE_CONSOLE_API_URL
const configModuleDomain = import.meta.env.VITE_MODULE_API_URL
const configAppVersion = import.meta.env.VITE_APP_VERSION
const configAppName = import.meta.env.VITE_APP_NAME

/******************
 * System Settings
 ******************/
const configLogoutUrl = '/logout'
const configSystemLogo = project[defaultProject].logo
const configSystemLogoWidth = project[defaultProject].logoWidth
    
export default class AppConfig {
    static get domain() { return configDomain }
    static get consoleDomain() { return configConsoleDomain }
    static get moduleDomain() { return configModuleDomain }
    static get systemLogo() { return configSystemLogo }
    static get logoutUrl() { return configLogoutUrl }
    static get systemLogoWidth() { return configSystemLogoWidth }
    static get appEnv() { return configAppEnv }
    static get appVersion() { return configAppVersion }
    static get appName() { return configAppName }
}
