import {sendError, sendRes} from "../utils/respond";
import {OAuth2Client} from 'google-auth-library'
import User from '../models/user'
import {createToken} from "../utils/token";
import {sendMail} from "../utils/email/qqEmail";
import jwt from '../middles/jwt'
import {asyncWrap} from "../utils/common";
import randtoken from 'rand-token'
import Token from '../models/token'

const CLIENT_ID = process.env.CLIENT_ID

const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
}

function genRefreshToken(email){
    return {
        email,
        refreshToken:randtoken.uid(256)
    }
}

async function loginByGoogle(req, res) {
    const token_id = req.body.token_id
    if (!token_id) {
        return sendError(res , 'bad request', 400)
    }
    const ticket = await verify(token_id)
    if (!ticket) {
        return sendError(res , 'google token error', 401)
    }
    const payload = ticket.getPayload()
    let query = {
        email: payload.email
    }
    let updateObj = {
        email: payload.email,
        isGoogle: true,
        name: payload.name,
        avatar: payload.picture
    }

    const user = await upsertUser(query , updateObj)
    const token = await createToken({email: user.email})
    updateObj = genRefreshToken(payload.email)
    const {refreshToken} = await upsertRefreshToken(query , updateObj)

    return sendRes(res , {
        user,
        token,
        refreshToken
    })
}
async function refreshToken(req, res) {
    const refreshToken = req.body.refreshToken
    const refToken = await Token.findOne({email:refreshToken.email})
    if(!refToken || refToken.refreshToken !== refreshToken.refreshToken){
        return sendError(res , 'refreshToken error', 401)
    }

    const token = await createToken({email:refreshToken.email})
    return sendRes(res , {
        token
    })
}
async function loginByMagic(req, res) {
    const email = req.body.email
    if (!email) {
        return sendError(res , 'need email', 400)
    }
    const token = await createToken({email})

    let updateObj = genRefreshToken(email)
    const {refreshToken} = await upsertRefreshToken({email} , updateObj)

    const link = `${process.env.MAGIC_LINK}${token}&refresh-token=${refreshToken}`
    const from = process.env.FROM
    const html = `<!doctype html> <html> <head>     <title>Meadowlark Travel</title> </head> <body> <h1>${link}</h1> </body> </html>`
    await sendMail(from, email, 'Login Verification', html)

    return sendRes(res , {info:'send email'})
}
//todo delete refresh token from db
async function logout(req , res) {
    return sendRes(res , {})
}
async function confirmMagicLink(req , res) {
    if(!req.user || !req.user.email){
        return sendError(res ,'token error' , 401)
    }
    const query = {
        email: req.user.email
    }
    const updateObj = {
        email: req.user.email,
        isGoogle: false
    }

    const user = await upsertUser(query , updateObj)

    return sendRes(res , {
        confirm:true,
        user
    })
}
async function upsertRefreshToken(query , data) {
    const token = await Token.findOneAndUpdate(query, data, {
        new: true,
        upsert: true
    })

    if(!token){
        throw new Error('db error : create token fail')
    }

    return token
}


async function upsertUser(query , data) {
    const user = await User.findOneAndUpdate(query, data, {
        new: true,
        upsert: true
    })

    if(!user){
        throw new Error('db error : create user fail')
    }

    return user
}
const registerRoutes = app => {
    app.post('/api/loginByGoogle',  asyncWrap(loginByGoogle))
    app.post('/api/loginByMagic',  asyncWrap(loginByMagic))
    app.post('/api/confirmMagicLink',  asyncWrap(confirmMagicLink))
    app.post('/api/refreshToken',  asyncWrap(refreshToken))
    app.post('/api/logout',  asyncWrap(logout))
}


export default registerRoutes
