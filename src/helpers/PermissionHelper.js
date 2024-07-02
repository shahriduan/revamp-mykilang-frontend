import ConstantConfig from '@/helpers/ConstantConfig'

function can(accessable) {
    var json = JSON.parse(localStorage.getItem(ConstantConfig.localStorageKey.permissionStore))
    const permissionProps = json?.permissions
    var result

    if (Array.isArray(accessable)) {
        result = accessable.filter(value => permissionProps.includes(value))
        result = result.length > 0 ? true : false
    } else {
        result = permissionProps.includes(accessable)
    }

    return result
}

function canAll(accessable) {
    // TODO|Low: Kalau ada masa buat logic ni
}

function cannot(notaccessable) {
    // TODO|Low: Kalau ada masa buat logic ni
}

export {
    can,
    canAll,
    cannot
}