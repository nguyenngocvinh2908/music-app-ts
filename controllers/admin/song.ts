import { Request, Response } from 'express'
import Song from '../../models/song'
import Topic from '../../models/topic'
import Singer from '../../models/singer'
import slugify from 'slugify'

// [ GET ] "/admin/songs"
export const index = async (req: Request, res: Response): Promise<void> => {
  const songs = await Song.find({ deleted: false })

  res.render('admin/pages/songs/index.pug', {
    songs: songs
  })
}

// [ GET ] "/admin/songs/create"
export const create = async (req: Request, res: Response): Promise<void> => {
  const topics = await Topic.find({ status: "active", deleted: false }).select("title")

  const singers = await Singer.find({ status: "active", deleted: false }).select("fullName")

  res.render('admin/pages/songs/create.pug', {
    topics: topics,
    singers: singers
  })
}

// [ POST ] "/admin/songs/create"
export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, topicId, singerId, description, status, avatar, audio, lyrics } = req.body;
  const newSong = new Song({ title, topicId, singerId, description, status, avatar, audio, lyrics, slug: slugify(title, { lower: true, strict: true })})
  await newSong.save()

  res.redirect(`/${(req as any).prefixAdmin || 'admin'}/songs`);
}

// [ GET ] "/admin/songs/edit/:idSong"
export const edit = async (req: Request, res: Response): Promise<void> => {
  const idSong = req.params.idSong
  const song = await Song.findOne({ _id: idSong, status: "active", deleted: false })
  const topics = await Topic.find({ status: "active", deleted: false }).select("title")

  const singers = await Singer.find({ status: "active", deleted: false }).select("fullName")

  res.render('admin/pages/songs/edit.pug', {
    song: song,
    topics: topics,
    singers: singers
  })
}

// [ POST ] "/admin/songs/edit/:idSong"
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  const idSong = req.params.idSong
  const { title, topicId, singerId, description, status, avatar, audio, lyrics } = req.body;
  await Song.updateOne({ _id: idSong }, { title, topicId, singerId, description, status, avatar, audio, lyrics })
  
  res.redirect(`/${(req as any).prefixAdmin || 'admin'}/songs/edit/${idSong}`);
}
