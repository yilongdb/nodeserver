import mongoose from 'mongoose'

const Schema = mongoose.Schema
const types = ['box' , 'text' , 'image' , 'icon' , 'component' , 'slot']
const layerSchema = new Schema({
    name:String,
    type:{type:String , lowercase:true,enum:types},
    cid:{type:Schema.Types.ObjectId ,required:true, index:true},
    isDeleted:{type:Boolean,default:false},
    subLayerOrder:{type:Array},
    parentID:{type:Schema.Types.ObjectId },
    styles:String
})

const layer = mongoose.model('layer' , layerSchema)

export default layer