import { Request, Response } from 'express'

// [ POST ] "/admin/dashboard"
export const index = async (req: Request, res: Response) => {
  res.status(200).json({
    location: req.body.file
  })
}