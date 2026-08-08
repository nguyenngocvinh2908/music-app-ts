import express, { Request, Response, Application } from 'express'
const app: Application = express()
const port: number = 3000

app.get('/topics', (req: Request, res: Response) => {
  res.send('List of topics')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
