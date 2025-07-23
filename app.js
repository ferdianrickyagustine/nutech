require('dotenv').config()

const express = require('express')
const UserController = require('./controllers/userController')
const authentication = require('./middlewares/authentication')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/register', UserController.register)
app.post('/login', UserController.login)

app.use(authentication)
app.get('/profile', UserController.profile)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})