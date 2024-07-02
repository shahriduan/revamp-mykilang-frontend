import Swal from 'sweetalert2'

function confirmDialog(message, confirmCallback) {
    Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Confirm',
        cancelButtonText: 'No, Cancel',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) { 
            confirmCallback()
        }
    }) 
}

export {
    confirmDialog
}