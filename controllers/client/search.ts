import { Request, Response } from 'express'
import Song from '../../models/song'
import Singer from '../../models/singer'
import { convertToSlug } from '../../helpers/convert-slug'
import strict from 'node:assert/strict'

// [ GET ] "/search/:type"
export const index = async (req: Request, res: Response) => {
  const type = req.params.type
  const rawKeyword   = req.query.keyword
  const keyword = typeof rawKeyword === 'string' ? rawKeyword.trim() : ''
  let newRecords: any[] = []
  if(keyword) {
    const keywordRegex = new RegExp(keyword, "i")
    // Tạo Slug
    const keywordSlug = convertToSlug(keyword)
    const keywordSlugRegex = new RegExp(keywordSlug, 'i')
    const searchSongs = await Song.find({
      $or: [
        { title: keywordRegex },
        { slug:  keywordSlugRegex},
      ],
      deleted: false
      })
    if(searchSongs.length > 0) {
      newRecords = await Promise.all(
          searchSongs.map(async (song) => {
          const inforSinger = await Singer.findOne({ _id: song.singerId, deleted: false })
          return {
            ...song,
            inforSinger: inforSinger
          }
        })
      )
    }
  }

  switch (type) {
    case "result":
      res.render('client/pages/search/index', {
        titlePage: keyword ?  `Search Music: ${keyword}` : "Search Music",
        keyword: keyword,
        records: newRecords
      })
      break
    case "suggest":
      res.json({
        code: 200,
        message: "Successful",
        records: newRecords
      })
      break
    default:
      break
  }
}