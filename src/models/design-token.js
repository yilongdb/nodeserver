import mongoose from 'mongoose'

const Schema = mongoose.Schema
const types = ['box' , 'text' , 'image' , 'icon' , 'component' , 'slot']
const tokenSchema = new Schema({
    fid:{type:Schema.Types.ObjectId  , required:true , index:true},
    name:String,
    value:String,
    isDeleted:{type:Boolean,default:false},
    type:{type:String,enum:types,lowercase:true}
})

const Token = mongoose.model('designToken' , tokenSchema , 'designTokens')

export default Token