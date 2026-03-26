// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (form.dataset.submitting === 'true') {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        form.dataset.submitting = 'true'

        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]')
        submitButtons.forEach(button => {
          if (button.dataset.submittingText) {
            if (button.tagName === 'INPUT') {
              button.value = button.dataset.submittingText
            } else {
              button.textContent = button.dataset.submittingText
            }
          }

          button.disabled = true
        })
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
