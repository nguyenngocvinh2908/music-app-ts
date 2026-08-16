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

// Handle Upload Audio Preview
const uploadAudioContainers = document.querySelector("[upload-audio]")
if(uploadAudioContainers) {
  const input = uploadAudioContainers.querySelector("[upload-audio-input]")
  const audioPlay = uploadAudioContainers.querySelector("[upload-audio-play]")
  const source = audioPlay.querySelector("source")
  input.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if(file) {
      source.src = URL.createObjectURL(file)
      audioPlay.load()
    }
  })
}