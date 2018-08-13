import bodyParser from 'body-parser'
import Rest from 'connect-rest'
// import passport from 'passport'
import express from "express"
// import cookieParser from 'cookie-parser'
import session from 'express-session'
const restOptions = {
    context: '/api'
}
const cookieSecret=process.env.COOKIE_SECRET

const rest = Rest.create(restOptions)

export default function applyMiddles(app , passport) {

    // app.use(bodyParser())

    // app.use(cookieParser())
    app.use(session({
        secret: cookieSecret
    }))
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    app.use(rest.processRequest())

    app.use(express.static('public'))
    return rest
}