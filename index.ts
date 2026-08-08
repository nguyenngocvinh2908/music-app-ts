import express, { Request, Response, Application } from 'express'
import dotenv from 'dotenv'
import * as database from './config/database'
const app: Application = express()
const port: number | string = process.env.PORT || 3000

// Pug
app.set('views', './views') // Specify the views directory
app.set('view engine', 'pug')

// Env
dotenv.config()

// Database
database.connectDatabase()

app.get('/topics', (req: Request, res: Response) => {
  res.render('client/pages/topics/index', { title: 'Topics Page' })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
