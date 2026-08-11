import { Request, Response } from 'express'
import Song from '../../models/song'
import Singer from '../../models/singer'
import FavouriteSong from '../../models/favourite-songs'

// [ GET ] "/favorite-songs/"
export const index = async (req: Request, res: Response) => {
  // The List Favorite Song
  const favoriteSongs = await FavouriteSong.find({ deleted: false })
  // The Infomation Singer, SongId
  const record = await Promise.all(
    favoriteSongs.map(async (item) => {
      const inforSong = await Song.findOne({ _id: item.songId, deleted: false })
      const inforSinger = await Singer.findOne({ _id: inforSong?.singerId, deleted: false })

      return {
        ...favoriteSongs,
        inforSong: inforSong,
        inforSinger: inforSinger 
      }
    })
  )

  res.render('client/pages/favorite-song/index', {
    titlePage: "Favorite Songs",
    favoriteSongs: record
  })
}