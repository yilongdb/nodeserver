import mongoose from 'mongoose'

const Schema = mongoose.Schema
const types = ['box' , 'text' , 'image' , 'icon' , 'component' , 'slot']
const tokenSchema = new Schema({
    fid:{type:String , required:true},
    name:String,
    value:String,
    isDeleted:{type:Boolean,default:false},
    type:{type:String,enum:types,lowercase:true}
})

// tokenSchema.pre('save' , function () {
//
// })

const Token = mongoose.model('DesignToken' , tokenSchema)

export default Token