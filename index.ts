import express, { Request, Response, Application } from 'express'
import dotenv from 'dotenv'
import * as database from './config/database'
import Topic from './models/topic'

const app: Application = express()
const port: number | string = process.env.PORT || 3000

// Pug
app.set('views', './views') // Specify the views directory
app.set('view engine', 'pug')

// Env
dotenv.config()

// Database
database.connectDatabase()

app.get('/topics', async (req: Request, res: Response) => {
  const topics = await Topic.find({ deleted: false })

  console.log(topics)
  
  res.render('client/pages/topics/index')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
