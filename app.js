// Source - https://stackoverflow.com/a/79874273
// Posted by Vin
// Retrieved 2026-04-10, License - CC BY-SA 4.0
//debido a que tuve problemas de un momento a otro estableciendo conexión con base de datos recibiendo el error:
// Error: querySrv ECONNREFUSED MongoDB, encontré esta solución en stackoverflow

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);



const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const morgan = require('morgan');
const middleware = require('./utils/middleware');
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login')

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
app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use('/api/login', loginRouter);

//morgan for debuggingf

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app