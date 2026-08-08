import express, { Request, Response, Application } from 'express'
const app: Application = express()
const port: number = 3000

// Pug
app.set('views', './views') // Specify the views directory
app.set('view engine', 'pug')

app.get('/topics', (req: Request, res: Response) => {
  res.render('client/pages/topics/index', { title: 'Topics Page' })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
