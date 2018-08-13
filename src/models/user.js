import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{type:String},
    authId:String,
    isGoogle:Boolean,
    name:String,
    avatar:String
})


userSchema.method.insertUser = function (user) {

}



const user = mongoose.model('user' , userSchema)


export default user