import {asyncWrap} from "../utils/common";
import Component from '../models/component'
import {getError, sendRes} from "../utils/respond";
import Layer from "../models/layer";

const idReg = /^[0-9a-fA-F]{24}$/
async function getLayers(req , res) {
    const cid = req.query.cid
    if(!idReg.test(cid)){
        throw getError('cid is not valid')
    }
    const layers = await Layer.find({cid})
    res.sendRes(layers)
}

async function getLayerById(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw getError('layer id is empty')
    }
    const layer = await Layer.findById(id)
    res.sendRes(layer)
}
async function createLayer(req , res) {
    const cid = req.body.cid
    if(!idReg.test(cid)){
        throw getError('cid is not valid')
    }
    const component = await Component.findById(cid)
    if(!component){
        throw getError('component is not exist')
    }
    let layer = new Layer(req.body)
    layer = await layer.save()
    res.sendRes(layer)
}

async function deleteLayer(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw getError('layer id is empty')
    }
    //update parent subLayerOrder
    await Layer.findOneAndUpdate({subLayerOrder:id} , {$pull:{subLayerOrder:id}})
    const layer = await Layer.findById(id)
    await layer.remove()
    res.sendRes({isDelete:true})
}

async function updateLayer(req , res) {
    const id = req.params.id
    if(!idReg.test(id)){
        throw getError('layer id Fis need')
    }
    const layer = await Layer.findOneAndUpdate(id , req.body , {new :true})
    res.sendRes(layer)
}
export default function registerRoutes(app){
    // app.get('/api/layers' ,asyncWrap(getLayers))
    // app.get('/api/layer/:id' ,asyncWrap(getLayerById))
    app.post('/api/layer',asyncWrap(createLayer))
    app.delete('/api/layer/:id' , asyncWrap(deleteLayer))
    app.put('/api/layer/:id' , asyncWrap(updateLayer))

}