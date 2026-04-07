const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const morgan = require('morgan');
const middleware = require('./utils/middleware');
const blogRouter = require('./controllers/blog');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(morgan('dev')) 
app.use(middleware.requestLogger)

app.use("/api/blogs", blogRouter);

//morgan for debuggingf

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app