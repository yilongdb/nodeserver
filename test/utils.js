import {createToken} from "../src/utils/token";
import User from "../src/models/user";
import File from "../src/models/file";
import Component from "../src/models/component";
import DesignToken from "../src/models/design-token";
import Layer from "../src/models/layer";

export const testEmail = '2099979030@qq.com'
export const authKey = 'authorization'
export async function getTokenTest() {
    const data = {
        email: testEmail
    }

    const token = await createToken(data)

    return `Bearer ${token}`
}

export async function clearDBTest() {
    await User.remove()
    await File.remove()
    await Component.remove()
    await DesignToken.remove()
    await Layer.remove()
}
export async function getUserTest() {
    let user = new User({
        email: testEmail,
        isGoogle: false
    })
    user = await user.save()

    return user
}
export async function getFileTest(userId) {

    let file = new File({
        ownerID: userId,
        name:'file name'
    })

    file = await file.save()

    return file
}
export async function getComponentTest(fid) {

    let component = new Component({
        fid,
        name:'component name'
    })

    component = await component.save()

    return component
}

export async function getLayerTest(cid , parentID = null , subLayerOrder = []) {

    let layer = new Layer({
        name: 'layer name',
        type: 'Box',
        cid,
        parentID,
        subLayerOrder,
        styles: 'styles'
    })

    layer = await layer.save()

    return layer
}


/*
* create layer tree

         x
       x<
     /   x
   /
 x<
   \      x
     \  x<
         x

* */
export async function createLayerTreeTest(cid) {
    const res = {}
    const root = await getLayerTest(cid)
    
    for(let i = 0 ; i < 2 ; i++){
        let l = await getLayerTest(cid , root.id)
        for(let j = 0 ; j < 2 ; j++){
            let k = await getLayerTest(cid , l.id)
            l.subLayerOrder.push(l.id)
            res[k.id] = k
        }
        root.subLayerOrder.push(l.id)
        res[l.id] = l
    }
    res[root.id] = root
    Object.keys(res).forEach(async key=>{
        let f = res[key]

        await Layer.findOneAndUpdate({_id:f.id} , f , {new:true})
    })
    return res
}
export async function getDesignTokenTest(fid , options = {}) {

    const defaultOption = {
        fid,
        name: 'design token',
        value: 'deisgn token value',
        type: 'BoX'
    }
    options = { ...defaultOption , ...options}
    let designToken = new DesignToken(options)

    designToken = await designToken.save()

    return designToken
}

export async function showTree() {
    const ls = await Layer.find()

    // const roots = ls.find()

    const tree = arrayToTree(ls)

    console.log(tree)
}
function arrayToDict(array) {
    let dict = {};
    for(let i in array) {
        let layer = array[i];
        dict[layer.id] = layer;
    }
    return dict;
}

function fillSublayers(node, dict) {
    let layers = [];
    for(let i in node.subLayerOrder) {
        let subnode = dict[node.subLayerOrder[i]];
        fillSublayers(subnode, dict);
        layers.push(subnode);
    }
    node.layers = layers;
}

function arrayToTree(layers) {
    let dict = arrayToDict(layers);
    let rootLayer = null;

    for(let id in dict) {
        if(!dict[id].parentID) {
            rootLayer = Object.assign({}, dict[id]);
            // tree.rootLayer.id = id;
            break;
        }
    }
    rootLayer && fillSublayers(rootLayer, dict);
    return rootLayer;
}