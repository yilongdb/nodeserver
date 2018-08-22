import mongoose from 'mongoose'

const Schema = mongoose.Schema
const types = ['box', 'text', 'image', 'icon', 'component', 'slot']
const layerSchema = new Schema({
    name: String,
    type: {type: String, lowercase: true, enum: types},
    cid: {type: Schema.Types.ObjectId, required: true, index: true},
    isDeleted: {type: Boolean, default: false},
    subLayerOrder: {type: Array},
    parentID: {type: Schema.Types.ObjectId , set: v=> v?v:null},
    styles: String,
    // deep: {type: Number, default: 0},
    // parentList: Array
})
// layerSchema.post('save', async function (layer) {
//     await update_children(layer)
// })
layerSchema.post('remove', async function (layer) {
    let chs = await Layer.find({parentID:layer.id})

    chs.forEach(async f=>{
        await f.remove()
    })
})

// layerSchema.statics.updateLayer = async function(id , data){
//     const oldLayer = await Layer.findById(id)
//     const layer = await Layer.findOneAndUpdate(id , data , {new:true})
//
//     if(compare_array(oldLayer.subLayerOrder , layer.subLayerOrder)){
//         console.log('no update subLayerOrder')
//         return layer
//     }
//     console.log('update subLayerOrder')
//     await update_children(layer)
//
//     return layer
// }
//
// function compare_array(src , dest){
//     if(!src || !dest || src.length !== dest.length){
//         return false
//     }
//
//     for(let i = 0 ; i < src.length ; i++){
//         let s = src[i]
//         if(dest.indexOf(s) === -1){
//             return false
//         }
//     }
//
//     return true
// }
// async function update_children(layer){
//     await generate_ancestors(layer.id , layer.parentID)
//
//     layer.subLayerOrder.forEach(async sub=>{
//         //update subLayerOrder
//         await generate_ancestors(sub.id , layer.id)
//         //update subLayers , sub layer
//         let subs = await Layer.find({'parentList._id':sub.id})
//         subs.forEach(async s=>{
//             await generate_ancestors(s.id , sub.parentID)
//         })
//     })
// }
// async function generate_ancestors(_id, parent_id) {
//     const ancestor_list = []
//     let p = await Layer.findById(parent_id)
//     while (p) {
//         ancestor_list.push(p.id)
//         p = await Layer.findById(p.parentID)
//     }
//     await Layer.update({_id: _id}, {$set: {parentList: ancestor_list , deep:ancestor_list.length , parentID:parent_id}})
// }
const Layer = mongoose.model('layer', layerSchema)

export default Layer