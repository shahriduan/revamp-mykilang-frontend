import Snackbar from 'node-snackbar'

// Default snackbar without customization
function snackbar(message) {
    Snackbar.show({ text: message, pos: 'bottom-center' })
}

export {
    snackbar
}