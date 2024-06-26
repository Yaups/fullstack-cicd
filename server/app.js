const express = require('express')
require('express-async-errors')
const cors = require('cors')
const path = require('path')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogsRouter')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/loginRouter')
const diagnosticsRouter = require('./controllers/diagnosticsRouter')
const config = require('./utils/config')
const mongoose = require('mongoose')
const app = express()

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test')
  app.use(express.static(path.join(__dirname, '..', 'dist'))) //This serves all the entire front-end!

logger.info('Connecting to MongoDB.')
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB.'))
  .catch((error) => logger.error(error))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use(diagnosticsRouter)

app.use(loginRouter)
app.use(usersRouter)
app.use(blogsRouter)

if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/testRouter')
  app.use(testRouter)
}

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
