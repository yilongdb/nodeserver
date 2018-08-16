import mongoose from 'mongoose'

const Schema = mongoose.Schema

const componentSchema = new Schema({
    fid:{type:String , required:true},
    isDeleted:{type:Boolean,default:false},
    name:String,
})

const component = mongoose.model('component' , componentSchema)

export default component
