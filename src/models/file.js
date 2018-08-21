import mongoose from 'mongoose'
import Component from './component'
import DesignToken from './design-token'
// import Layer from './layer'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const fileSchema = new Schema({
    ownerID:{type:Schema.Types.ObjectId ,index:true},
    isDeleted:{type:Boolean , default:false},
    name:String
})

fileSchema.post('remove' , async function (file) {
    const fid = file.id
    // await Component.remove({fid})
    await DesignToken.remove({fid})

    const cursor = await Component.find({fid}).cursor()
    let c = await cursor.next()
    while (c){
        await c.remove()
        c = await cursor.next()
    }
})

fileSchema.statics.getFileById = async function (id) {
    const files = await File.aggregate([
        {
            //id must be ObjectId
            $match: {_id: ObjectId(id)}
        },
        {
            $lookup: {
                from: 'components',
                localField: '_id',
                foreignField: 'fid',
                as: 'components'
            }
        },
        {
            $unwind: {
                path: '$components',
                //enable empty component
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'layers',
                localField: 'components._id',
                foreignField: 'cid',
                as: 'components.layers'
            }
        },
        {
            $group: {
                _id: '$_id',
                name: {$first: "$name"},
                ownerID: {$first: "$ownerID"},
                components: {$push: '$components'}
            }
        },
        {
            $lookup: {
                from: 'designTokens',
                localField: '_id',
                foreignField: 'fid',
                as: 'designTokens'
            }
        },
        {
            $project: {
                name: 1,
                ownerID: 1,
                designTokens:1,
                components: {
                    $filter: {
                        input: '$components',
                        as: 'c',
                        cond: {$ifNull: ['$$c._id', false]}
                    }
                }
            }
        }
    ])
    const file = files && files.length > 0 ? files[0] : null
    return file
}
const File = mongoose.model('file' , fileSchema)

export default File