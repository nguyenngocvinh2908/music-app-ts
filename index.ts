import express, { Request, Response, Express } from 'express'
import dotenv from 'dotenv'
import * as database from './config/database'
import clientRoutes from './routes/client'
import adminRoutes from './routes/admin'
import { systemConfig } from 'config/config'
import path from 'path'

const app: Express = express()
const port: number | string = process.env.PORT || 3000

// Pug
app.set('views', './views') // Specify the views directory
app.set('view engine', 'pug')

// Env
dotenv.config()

// Global Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin

// Tiny MCE Setup
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Nhúng file tĩnh (CSS, JS, hình ảnh,...) vào ứng dụng
app.use(express.static('public'))

// Database
database.connectDatabase()

// Client Routes And Amin Router
adminRoutes(app)
clientRoutes(app)



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
