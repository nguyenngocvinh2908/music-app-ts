import { Request, Response } from 'express'
import Song from '../../models/song'

// [ GET ] "/admin/songs"
export const index = async (req: Request, res: Response): Promise<void> => {
  const songs = await Song.find({ deleted: false })

  res.render('admin/pages/songs/index.pug', {
    songs: songs
  })
}