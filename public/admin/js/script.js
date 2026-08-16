// Handle Upload Image Preview
const uploadImageContainers = document.querySelector("[upload-image]")
if(uploadImageContainers) {
  const input = uploadImageContainers.querySelector("[upload-image-input]")
  const preview = uploadImageContainers.querySelector("[upload-image-preview]")
  input.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if(file) preview.src = URL.createObjectURL(file)
  })
}