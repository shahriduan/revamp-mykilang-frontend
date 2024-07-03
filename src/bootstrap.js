/**
 * Axios
 * 
 * Work as intercepter
 */
import axios from 'axios'
import { useAuthStore } from '@/stores/AuthStore'

window.axios = axios

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

window.axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const statusCode = error.response?.status || 'An error occured'
    const errorMessage = error.response?.data?.message || 'An error occurred'

    if (statusCode == 401 && errorMessage == 'Unauthenticated.') {
        useAuthStore().removeAuth()
        window.location.href = "/"
    }

    if (statusCode == 403 && (errorMessage == 'This action is unauthorized.' || errorMessage == 'User does not have the right permissions.')) {
        window.location.href = "/"
    }
    
    return Promise.reject(error)
})

/**
 * Dayjs
 * 
 * Initialize custom parse format
 */
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)