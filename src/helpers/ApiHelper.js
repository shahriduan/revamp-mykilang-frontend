import apiRouter from '@/router/api'

function apiRoute(routerOption) {
    var domain = apiRouter.resolve(routerOption).meta.domain
    var path = apiRouter.resolve(routerOption).fullPath
    var fullUrl = domain + path

    return fullUrl
}

export default apiRoute