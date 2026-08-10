// Libary Aplayer JS
const aplayer = document.querySelector("#aplayer")
if(aplayer) {
  const songData = JSON.parse(aplayer.getAttribute("data-song"))
  const singerData = JSON.parse(aplayer.getAttribute("data-singer"))
  const ap = new APlayer({
    container: aplayer,
    audio: [{
      name: songData.title,
      artist: singerData.fullName,
      url: songData.audio,
      cover: songData.avatar
    }],
    autoPlay: true
  })

  const avatarPlate = document.querySelector('.singer-avatar')
  if(avatarPlate) {
    ap.on('play', function() {
      avatarPlate.style.animationPlayState = "running"
    })

    ap.on('pause', function() {
      avatarPlate.style.animationPlayState = "paused"
    })
  }
}


