import mongoose from 'mongoose'
import DesignToken from "./design-token";
import Layer from './layer'
const Schema = mongoose.Schema

const componentSchema = new Schema({
    fid:{type:Schema.Types.ObjectId , required:true, index:true},
    isDeleted:{type:Boolean,default:false},
    name:String,
})

componentSchema.post('remove' , async function (component) {
    const cid = component.id
    await Layer.remove({cid})
})

const component = mongoose.model('component' , componentSchema)

export default component
