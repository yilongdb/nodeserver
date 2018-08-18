import mongoose from 'mongoose'

const Schema = mongoose.Schema

const fileSchema = new Schema({
    ownerID:String,
    isDeleted:{type:Boolean , default:false},
    name:String
})

fileSchema.statics.getFiles = function () {
    const File = mongoose.model('file')
    return File.find()
}
fileSchema.statics.getFileById = function (id) {
    const File = mongoose.model('file')
    return File.find({_id:id})
}

const File = mongoose.model('file' , fileSchema)

export default File