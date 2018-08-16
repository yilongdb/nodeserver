import mongoose from 'mongoose'

const Schema = mongoose.Schema
const types = ['box' , 'text' , 'image' , 'icon' , 'component' , 'slot']
const layerSchema = new Schema({
    name:String,
    type:{type:String , lowercase:true,enum:types},
    cid:{type:String,required:true},
    isDeleted:{type:Boolean,default:false},
    subLayerOrder:{type:Array},
    parentID:{type:String},
    styles:String
})

const layer = mongoose.model('layer' , layerSchema)

export default layer