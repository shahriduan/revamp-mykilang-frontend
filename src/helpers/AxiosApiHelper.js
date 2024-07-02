import apiRoute from '@/helpers/ApiHelper'

/**
 * This helper is use to call API. To prevent repetitive API call in every page.
 * If API is being call more that one, you can register that API call here.
 * Priority to register API calls is GET method.
 * To create new method please add 'axios' at start of method name.
 *
 * Example:
 * Method name is getUserProfile(). So you need to add keyword 'axios' in this method name. It will become axiosGetUserProfile().
 */

/**
 * Authenticated user
 */
async function axiosGetUserProfile(callback) {
    await window.axios.get(apiRoute({ name: 'api:user_profile' }))
        .then(function(response) {
            callback(response)
        })
}

/**
 * State of country
 */
async function axiosGetStateOfCountry(callback) {
    await window.axios.get(apiRoute({ name: 'api:get_state' }))
        .then(function(response) {
            callback(response)
        })
}

/**
 * List of Timezone
 */
async function axiosGetTimezoneList(callback) {
    await window.axios.get(apiRoute({ name: 'api:get_timezones' }))
        .then(function(response) {
            callback(response)
        })
}

/**
 * List of platform module
 */
async function axiosGetModuleList(callback) {
    await window.axios.get(apiRoute({ name: 'api:platform_module.module_list' }))
        .then(function(response) {
            callback(response)
        })
}

export {
    axiosGetUserProfile,
    axiosGetStateOfCountry,
    axiosGetModuleList,
    axiosGetTimezoneList
}
