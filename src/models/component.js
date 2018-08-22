import mongoose from 'mongoose'
import DesignToken from "./design-token";
import Layer from './layer'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const componentSchema = new Schema({
    fid:{type:Schema.Types.ObjectId , required:true, index:true},
    isDeleted:{type:Boolean,default:false},
    name:String,
})
componentSchema.statics.getComponentById = async function (id) {
    const components = await Component.aggregate([
        {
            //id must be ObjectId
            $match: {_id: ObjectId(id)}
        },
        {
            $lookup: {
                from: 'layers',
                localField: '_id',
                foreignField: 'cid',
                as: 'layers'
            }
        },
        {
            $project: {
                fid: 1,
                isDeleted: 1,
                name:1,
                layers:{
                    _id:1,
                    name:1,
                    type:1,
                    cid:1,
                    isDeleted:1,
                    subLayerOrder:1,
                    parentID:1,
                    styles:1
                }
            }
        }
    ])
    return components && components.length > 0 ? components[0] : null
}

componentSchema.statics.getAllComponents = async function (fid) {
    const components = await Component.aggregate([
        {
            //id must be ObjectId
            $match: {fid: ObjectId(fid)}
        },
        {
            $lookup: {
                from: 'layers',
                localField: '_id',
                foreignField: 'cid',
                as: 'layers'
            }
        },
        {
            $project: {
                fid: 1,
                isDeleted: 1,
                name:1,
                layers:{
                    _id:1,
                    name:1,
                    type:1,
                    cid:1,
                    isDeleted:1,
                    subLayerOrder:1,
                    parentID:1,
                    styles:1
                }
            }
        }
    ])

    return components
}



componentSchema.post('remove' , async function (component) {
    const cid = component.id
    await Layer.remove({cid})
})

const Component = mongoose.model('component' , componentSchema)

export default Component
