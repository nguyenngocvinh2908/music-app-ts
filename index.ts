import express, { Request, Response, Express } from 'express'
import dotenv from 'dotenv'
import * as database from './config/database'
import clientRoutes from './routes/client'

const app: Express = express()
const port: number | string = process.env.PORT || 3000

// Pug
app.set('views', './views') // Specify the views directory
app.set('view engine', 'pug')

// Env
dotenv.config()

// Nhúng file tĩnh (CSS, JS, hình ảnh,...) vào ứng dụng
app.use(express.static('public'))

// Database
database.connectDatabase()

// Client Routes
clientRoutes(app)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
