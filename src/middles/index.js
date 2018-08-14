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

const app = express()
app.set('port', process.env.PORT || 3000)

const restOptions = {
    context: '/api'
}
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

    app.use(cors())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    // app.use(rest.processRequest())
    app.use(jwt)
    app.use(express.static('public'))

    registerRouter(app)
    initDB(app)

    logger.info('init middles')
    console.log('init middles')
    return app
}