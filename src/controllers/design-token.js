import {asyncWrap} from "../utils/common";
import DesignToken from '../models/design-token'
import User from '../models/user'
import File from '../models/file'
import {getError, sendRes} from "../utils/respond";



const idReg = /^[0-9a-fA-F]{24}$/
async function getDesignTokens(req , res) {
    const fid = req.query.fid
    if(!idReg.test(fid)){
        throw getError('fid is not valid')
    }
    const tokens = await DesignToken.find({fid})
    res.sendRes(tokens)
}

// async function getDesignTokenById(req , res) {
//     const id = req.params.id
//     if(!idReg.test(id)){
//         throw getError('token id is empty')
//     }
//     const token = await DesignToken.findById(id)
//     res.sendRes(token)
// }
async function createDesignToken(req , res) {
    const fid = req.body.fid
    if(!idReg.test(fid)){
        throw getError('fid is not valid')
    }
    const file = await File.findById(fid)
    if(!file){
        throw getError('file is not exist')
    }
    let token = new DesignToken(req.body)
    token = await token.save()
    res.sendRes(token)
}

async function deleteDesignToken(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw getError('token id is empty')
    }
    await DesignToken.findOneAndDelete(id)
    res.sendRes({isDelete:true})
}

async function updateDesignToken(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw getError('token id is need')
    }
    const token = await DesignToken.findOneAndUpdate({_id:id} , req.body , {new:true})
    res.sendRes(token)
}

export default function registerRoutes(app){
    app.get('/api/design-tokens' ,asyncWrap(getDesignTokens))
    // app.get('/api/design-token/:id' ,asyncWrap(getDesignTokenById))
    app.post('/api/design-token',asyncWrap(createDesignToken))
    app.delete('/api/design-token/:id' , asyncWrap(deleteDesignToken))
    app.put('/api/design-token/:id' , asyncWrap(updateDesignToken))
}