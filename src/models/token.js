import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    email:{type:String, index:true},
    refreshToken:{type:String,required:true}
})



const token = mongoose.model('token' , tokenSchema)


export default token