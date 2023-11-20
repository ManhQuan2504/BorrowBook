import Swal from 'sweetalert2'

export const Notification = (title, text, icon) => {
  Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: `${icon}`,
    showCancelButton: icon === 'error' ? true : false,
    confirmButtonColor: 'red',
    cancelButtonColor: '#d33',
    confirmButtonText:
      'OK'
  })
}

export const SendEmail = (apiSendEmail) => {
  Swal.fire({
    title: 'Forgot your password?',
    input: 'email',
    inputLabel: 'Your email address',
    inputPlaceholder: 'Enter your email address',
    confirmButtonText: 'Send',
    showLoaderOnConfirm: true,
    preConfirm: (email) => apiSendEmail(email),
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${result.value.message}`,
        icon: result.value.code === 200 ? 'success' : 'error',
      })
    }
  })
}
