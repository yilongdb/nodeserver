import bodyParser from 'body-parser'
import Rest from 'connect-rest'
import express from "express"
import expressHandlebars from 'express3-handlebars'
import registerRouter from '../controllers'
import cors from "cors";
import path from "path";
import initDB from '../config/db'
import jwt from './jwt'
import logger from '../utils/logger'
import compression from 'compression'
import http from './http'
const app = express()
app.set('port', process.env.PORT || 3000)

const restOptions = {
    context: '/api'
}
78
const cookieSecret = process.env.COOKIE_SECRET

const rest = Rest.create(restOptions)

const handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
})

export default function applyMiddles() {

    app.engine('handlebars', handlebars.engine)
    app.set('view engine', 'handlebars')
    app.set('views', 'src/views/')

    app.use(compression())
    app.use(cors())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    // app.use(rest.processRequest())
    app.use(jwt)
    app.use(express.static('public'))
    http(app)
    registerRouter(app)
    initDB(app)

    logger.info('init middles')
    return app
}