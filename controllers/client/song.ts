import { Request, Response } from 'express'
import Topic from '../../models/topic'
import Song from '../../models/song'
import Singer from '../../models/singer'

// [ GET ] "/songs/:slugTopic"
export const songsOfTopic = async (req: Request, res: Response) => {
  try {
    // Params
    const slugTopic: string | string[] = req.params.slugTopic
    // Get The ID Topic
    const topic = await Topic.findOne({ slug: slugTopic, status: "active", deleted: false })
    // Check Data
    if(!topic) {
      return res.status(404).render('client/pages/errors/index', {
        errorCode: "404",
        errorTitle: "My Page Search Not Found",
        errorMessage: "The link may be broken, or this page has been removed."
      })
    }

    // Get The Mucsic Flow Id Topic
    const songs = await Song.find({ topicId : topic._id.toString(), status: "active", deleted: false }).select("avatar title slug singerId like").lean()

    const songsWidthSinger = await Promise.all( // Chay Song Song Vs Nhau
      songs.map(async (song) => {
        const inforSinger = await Singer.findOne({ _id: song.singerId, status: "active", deleted: false }).select("fullName avatar").lean()
        return {
          ...song,
          inforSinger: inforSinger
        }
      })
    )

    res.render('client/pages/songs/index', {
      titlePage: `Songs Music Of Topic ${topic.title}`,
      songs: songsWidthSinger
    })
  } catch(e) {
    return res.status(500).render('client/pages/errors/index', {
      errorCode: "500",
      errorTitle: "A server error occurred.",
      errorMessage: "The system is experiencing an interruption. Please try again in a few minutes."
    });
  }
}

// [ GET ] "/song/detail/:slugSong"
export const songDetail = async (req: Request, res: Response) => {
  const slugSong: String | String[] = req.params.slugSong
  // Get The Infomation Song
  const song: any = await Song.findOne({ slug: slugSong.toString(), status: "active", deleted: false })
  // Get The Singer
  const singerOfSong = await Singer.findOne({ _id: song.singerId, status: "active", deleted: false }).select('fullName')
  // Get The Topic
  const topicOfSong = await Topic.findOne({ _id: song.topicId, status: "active", deleted: false })
  try {
    res.render('client/pages/songs/detail', {
      titlePage: song.title,
      song: song,
      singer: singerOfSong,
      topic: topicOfSong
    })
  } catch(e) {
    return res.status(500).render('client/pages/errors/index', {
      errorCode: "500",
      errorTitle: "A server error occurred.",
      errorMessage: "The system is experiencing an interruption. Please try again in a few minutes."
    });
  }
}

