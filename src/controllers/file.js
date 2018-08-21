import {asyncWrap} from "../utils/common";
import File from '../models/file'
import User from '../models/user'
import {getError} from "../utils/respond";
import mongoose from 'mongoose'


const idReg = /^[0-9a-fA-F]{24}$/

async function getFiles(req, res) {
    const files = await File.find()
    res.sendRes({files})
}

//return file->{componets->{layers},designtokens}
async function getFileById(req, res) {
    const id = req.params.id
    if (!id) {
        throw new Error('file id is empty')
    }
    const file = await File.getFileById(id)
    res.sendRes(file)
}

async function createFile(req, res) {
    const userId = req.body.ownerID
    if (!idReg.test(userId)) {
        throw new Error('userId is not valid')
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new Error('user is empty')
    }
    let file = new File(req.body)
    file = await file.save()
    res.sendRes(file)
}
//delelte file -> component , designtoken ->layer
async function deleteFile(req, res) {
    const id = req.params.id
    if (!id) {
        throw getError('file id is empty')
    }
    const file = await File.findById(id)
    //for fired post hook
    await file.remove()
    res.sendRes({isDelete: true})
}

async function updateFile(req, res) {
    const fileId = req.params.id
    if (!idReg.test(fileId)) {
        throw getError('file id is need')
    }
    // const file = await File.update({id:fileId} , req.body)
    const file = await File.findOneAndUpdate({_id: fileId}, req.body, {new: true})
    res.sendRes({file})
}

export default function registerRoutes(app) {
    app.get('/api/files', asyncWrap(getFiles))
    app.get('/api/file/:id', asyncWrap(getFileById))
    app.post('/api/file', asyncWrap(createFile))
    app.delete('/api/file/:id', asyncWrap(deleteFile))
    app.put('/api/file/:id', asyncWrap(updateFile))

}