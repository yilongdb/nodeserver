import {asyncWrap} from "../utils/common";
import File from '../models/file'
import Component from '../models/component'
import {getError, sendRes} from "../utils/respond";

const idReg = /^[0-9a-fA-F]{24}$/
//get components->{layers}
async function getComponents(req , res) {
    const fid = req.query.fid
    if(!idReg.test(fid)){
        throw new Error('fid is not valid')
    }
    const components = await Component.find({fid})
    res.sendRes(components)
}
//get component->{layers}
async function getComponentById(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw new Error('component id is empty')
    }
    const component = await Component.findById(id)
    res.sendRes(component)
}
async function createComponent(req , res) {
    const fid = req.body.fid
    if(!idReg.test(fid)){
        throw new Error('fid is not valid')
    }
    const file = await File.findById(fid)
    if(!file){
        throw new Error('file is not exist')
    }
    let component = new Component(req.body)
    component = await component.save()
    res.sendRes(component)
}

async function deleteComponent(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw getError('component id is empty')
    }
    await Component.findOneAndDelete(id)
    res.sendRes({isDelete:true})
}

async function updateComponent(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw getError('component id is need')
    }
    const component = await Component.findOneAndUpdate({_id:id} , req.body , {new:true})
    res.sendRes(component)
}
export default function registerRoutes(app){
    app.get('/api/components' ,asyncWrap(getComponents))
    app.get('/api/component/:id' ,asyncWrap(getComponentById))
    app.post('/api/component',asyncWrap(createComponent))
    app.delete('/api/component/:id' , asyncWrap(deleteComponent))
    app.put('/api/component/:id' , asyncWrap(updateComponent))

}