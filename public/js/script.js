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

// Button Like Song
const buttonLike = document.querySelector('[data-id-song]')
if(buttonLike) {
  buttonLike.addEventListener('click', (e) =>{
    const idSong = buttonLike.getAttribute('data-id-song')
    const link = buttonLike.classList.contains('active') ? `/songs/like/dislike/${idSong}` : `/songs/like/like/${idSong}`

    fetch(link, { method: 'PATCH' }).then(res => res.json()).then(data => {
      if(data.code === 200) {
        const countLike = buttonLike.querySelector("span")
        countLike.innerHTML = `${data.like}`
        buttonLike.classList.toggle("active")
      }
    })
  })
}

// Button Favourite
const ListButtonFavourite = document.querySelectorAll('[data-favourite-id-song]')
if(ListButtonFavourite.length > 0) {
  ListButtonFavourite.forEach((buttonFavourite) => {
    buttonFavourite.addEventListener('click', (e) =>{
      const idSong = buttonFavourite.getAttribute('data-favourite-id-song')
      const link = buttonFavourite.classList.contains('active') ? `/songs/favourite/unfavourite/${idSong}` : `/songs/favourite/favourite/${idSong}`

      fetch(link, { method: 'PATCH' }).then(res => res.json()).then(data => {
        if(data.code === 200) buttonFavourite.classList.toggle("active")
      })
    })
  })
}

// Search Suggest
const boxSearch = document.querySelector('.box-search')
if(boxSearch) {
  const input = boxSearch.querySelector('input[name="keyword"')
  input.addEventListener('keyup', () => {
    const keyword = input.value

    const link = `/search/suggest?keyword=${keyword}`

    fetch(link).then(res  => res.json()).then(data => {
      if(data.code === 200) {
        const boxSuggest = boxSearch.querySelector('.inner-suggest')
        const songs = data.records 
        if(songs.length > 0) {
          boxSuggest.classList.add('show')
          const htmls = songs.map((song) => {
            return `
              <a class="inner-item" href="/songs/detail/${song._doc.slug}">
                <div class="inner-image">
                  <img src="${song._doc.avatar}" alt="${song._doc.title}">
                </div>
                <div class="inner-info">
                  <div class="inner-title">${song._doc.title}</div>
                  <div class="inner-singer">
                    <i class="fa-solid fa-microphone-lines"></i> ${song.inforSinger.fullName}
                  </div>
                </div>
              </a>
            `
          })
          const boxList = boxSuggest.querySelector('.inner-list')
          boxList.innerHTML = htmls.join("")
        } else {
          boxSuggest.classList.remove('show')
        }
      }
    })
  })
}