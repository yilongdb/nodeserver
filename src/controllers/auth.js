import {sendError, sendRes} from "../utils/respond";
import {OAuth2Client} from 'google-auth-library'
import User from '../models/user'
import {createToken} from "../utils/token";
import {sendMail} from "../utils/email";

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

async function loginByGoogle(req, {token_id}) {
    if (!token_id) {
        sendError('bad request', 400)
    }
    const ticket = await verify(token_id)
    if (!ticket) {
        sendError('google token error', 401)
    }
    const payload = ticket.getPayload()
    const query = {
        email: payload.email
    }
    const updateObj = {
        email: payload.email,
        isGoogle: true,
        name: payload.name,
        avatar: payload.picture
    }
    const user = await User.findOneAndUpdate(query, updateObj, {
        new: true,
        upsert: true
    })
    if (!user) {
        return sendError('db error')
    }

    const token = await createToken({email: user.email})
    if (!token) {
        return sendError('create token error')
    }
    return sendRes({
        user,
        token
    })
}

async function loginByMagic(req, {email}) {
    if (!email) {
        sendError('need email', 400)
    }
    const token = await createToken({email})
    const link = `${process.env.MAGIC_LINK}${token}`
    const from = process.env.FROM
    const html = `<!doctype html> <html> <head>     <title>Meadowlark Travel</title> </head> <body> <h1>${link}</h1> </body> </html>`
    await sendMail(from, email, 'Login Verification', html)

    return {info:'send email'}
}


const registerRoutes = app => {
    app.post('/loginByGoogle', loginByGoogle)
    app.post('/loginByMagic', loginByMagic)
}


export default registerRoutes
