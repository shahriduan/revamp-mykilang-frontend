import 'js-loading-overlay'

/**
 * @param {string} action Example: 'show' or 'hide'
 */
function loadingOverlay(action) {
    if (action == 'show') {
        JsLoadingOverlay.show({
            "overlayBackgroundColor": "#666666",
            "overlayOpacity": 0.3,
            "spinnerIcon": "line-scale",
            "spinnerColor": "#ea1D22",
            "spinnerSize": "3x",
            "overlayIDName": "overlay",
            "spinnerIDName": "spinner",
            "offsetX": 0,
            "offsetY": 0,
            "containerID": null,
            "lockScroll": true,
            "overlayZIndex": 9998,
            "spinnerZIndex": 9999
        })
    } else {
        JsLoadingOverlay.hide()
    }      
}

export {
    loadingOverlay
}