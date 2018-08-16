import {asyncWrap} from "../utils/common";
import File from '../models/file'
import User from '../models/user'
import {sendRes} from "../utils/respond";


const idReg = /^[0-9a-fA-F]{24}$/
async function getFiles(req , res) {
    const files = await File.getFiles()
    res.sendRes({files})
}

async function getFileById(req , res) {
    const id = req.params.id
    if(!id){
        throw new Error('file id is empty')
    }
    const file = File.getFileById(id)
    res.sendRes(file)
}

async function createFile(req , res) {
    const userId = req.body.ownerID
    if(!idReg.test(userId)){
        throw new Error('userId is not valid')
    }
    const user = await User.findById(userId)
    if(!user){
        throw new Error('user is empty')
    }
    let file = new File(req.body)
    file = await file.save()
    res.sendRes(file)
}

async function deleteFile(req , res) {
    const id = req.params.id
    if(!id){
        throw new Error('file id is empty')
    }
    await File.delete(id)
    res.sendRes({isDelete:true})
}

async function updateFile(req , res) {
    const file = await File.update({id:req.body.id} , req.body)
    res.sendRes({file})
}

export default function registerRoutes(app){
    app.get('/api/files' ,asyncWrap(getFiles))
    app.get('/api/file/:id' ,asyncWrap(getFiles))
    app.post('/api/file',asyncWrap(createFile))
    app.delete('/api/file/:id' , asyncWrap(deleteFile))
    app.put('/api/file' , asyncWrap(updateFile))

}