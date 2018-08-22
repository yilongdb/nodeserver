import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import Component from '../../src/models/component'
import server from '../../src/main'
import {
    authKey,
    clearDBTest,
    createLayerTreeTest,
    getComponentTest,
    getFileTest,
    getLayerTest,
    getTokenTest,
    getUserTest
} from "../utils";
import Layer from "../../src/models/layer";

const ObjectId = mongoose.Types.ObjectId
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
let authHeader = ''
let user = ''
let file = ''
chai.use(chaiHttp)


describe('Component routes', () => {
    before(async () => {
        await clearDBTest()
        authHeader = await getTokenTest()
        user = await getUserTest()
        file = await getFileTest(user.id)
    })


    afterEach(async () => {
        await Component.remove()
    })

    after(async ()=>{
        await clearDBTest()
    })
    describe('/GET components', () => {
        it('it should GET all the components , with length = 0', async () => {
            
            const res = await chai.request(server)
                .get(`/api/components?fid=${file.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.a('array').is.empty
        })

        it('it should not GET all the components , without file id', async () => {


            const res = await chai.request(server)
                .get(`/api/components`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(400)
            res.should.nested.have.property('body.message' , 'fid is not valid')
        })

        it('it should GET all the components , with array length = 5', async () => {

            const dt = []
            for(let i = 0 ; i < 5 ; i++){
                dt.push(await getComponentTest(file.id))
            }
            const res = await chai.request(server)
                .get(`/api/components?fid=${file.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.a('array').lengthOf(5)
        })

        it('it should GET all the components , with array length = 5 , and all have layers lenght = 7', async () => {

            const dt = []
            for(let i = 0 ; i < 5 ; i++){
                let c = await getComponentTest(file.id)

                let layers = await createLayerTreeTest(c.id)
                dt.push({
                    component:c,
                    layers
                })
            }
            const res = await chai.request(server)
                .get(`/api/components?fid=${file.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.a('array').lengthOf(5)
            for(let i = 0 ; i < 5 ; i++){
                res.body.should.be.nested.property(`[${i}].layers`).is.a('array').lengthOf(7)
            }
        })

    })
    describe('/GET/:id component', () => {
        it('it should GET  the component and all the layers , combine with a layer tree', async () => {
            let component = await getComponentTest(file.id)
            const layers = await createLayerTreeTest(component.id)


            const res = await chai.request(server)
                .get(`/api/component/${component.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.include({
                fid:component.fid.toString(),
                name:component.name
            })

            res.body.should.be.nested.property('layers').that.is.a('array').lengthOf(7)

            res.body.layers.forEach(layer=>{
                let l = layers[layer._id]
                layer.should.nested.include({
                    name:l.name,
                    type:l.type.toLowerCase(),
                    _id:l.id.toString(),
                    cid:l.cid.toString(),
                    parentID:l.parentID ? l.parentID.toString() : null,
                    styles:l.styles,
                    isDeleted:l.isDeleted,

                })

                for(let i = 0 ; i < layer.subLayerOrder.length ; i++){
                    let sl = layer.subLayerOrder[i]
                    sl.should.equal(l.subLayerOrder[i].toString())
                }
            })

        })
    })

    describe('/POST component', () => {
        it('it should POST a component', async () => {

            const data = {
                fid : file.id,
                name:'component name'
            }

            const res = await chai.request(server)
                .post('/api/component')
                .type('form')
                .set(authKey, authHeader)
                .send(data)
            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.a('object').include(data)
        })

        it('it should not POST a component for not exist file', async () => {

            const randomId = mongoose.Types.ObjectId()
            const data = {
                fid : randomId.toString(),
                name:'component name'
            }

            const res = await chai.request(server)
                .post('/api/component')
                .type('form')
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(400)
            res.should.nested.have.property('body.message' , 'file is not exist')
        })
    })


    describe('/DELETE/:id component', () => {
        it('it should DELETE a component given the id', async () => {
            let component = await getComponentTest(file.id)


            const res = await chai.request(server)
                .delete(`/api/component/${component.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)

            res.should.have.status(200)
            res.body.should.have.property('isDelete').that.is.true

            component = await Component.findById(component.id)
            should.equal(component , null)
        })

        it('it should DELETE a component given the id , and layers', async () => {
            let component = await getComponentTest(file.id)


            for (let j = 0; j < 5; j++) {
                await getLayerTest(component.id)
            }
            
            const res = await chai.request(server)
                .delete(`/api/component/${component.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)

            res.should.have.status(200)
            res.body.should.have.property('isDelete').that.is.true

            let c = await Component.findById(component.id)
            should.equal(c , null)
            
            let layers = await Layer.find({cid:component.id})
            layers.should.be.a('array').lengthOf(0)
        })
        
    })


    describe('/PUT/:id component', () => {
        it('it should UPDATE a component given the id', async () => {
            let component = await getComponentTest(file.id)
            const data = {
                fid : file.id,
                name: 'component modify',
            }
            const res = await chai.request(server)
                .put(`/api/component/${component.id}`)
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(200)

            res.body.should.include(data)
        })
    })

})