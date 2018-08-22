import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import Layer from '../../src/models/layer'
import server from '../../src/main'
import {
    authKey,
    clearDBTest,
    getComponentTest,
    getFileTest,
    getTokenTest,
    getUserTest,
    getLayerTest,
    createLayerTreeTest
} from "../utils";

const ObjectId = mongoose.Types.ObjectId
const assert = chai.assert
const expect = chai.expect

const should = chai.should()
let authHeader = ''
let user = ''
let file = ''
let component = ''
chai.use(chaiHttp)


describe('Layer routes', () => {
    before(async () => {
        await clearDBTest()
        authHeader = await getTokenTest()
        user = await getUserTest()
        file = await getFileTest(user.id)
        component = await getComponentTest(file.id)
    })


    afterEach(async () => {
        await Layer.remove()
    })
    

    describe('/POST layer', () => {
        it('it should POST a layer', async () => {

            const data = {
                name: 'layer name',
                type: 'Box',
                cid:component.id,
                parentID:null,
                subLayerOrder:[],
                styles: 'styles'
            }

            const res = await chai.request(server)
                .post('/api/layer')
                .type('form')
                .set(authKey, authHeader)
                .send(data)
            // console.log(res.body)
            should.not.equal(res, null)
            res.should.have.status(200)
            data.type = data.type.toLowerCase()
            //use deep compare array
            res.body.should.be.deep.a('object').include(data)
        })

        // it('it should POST a layer , insert to rootLayer , and update sublayers', async () => {
        //
        //     const layers = await createLayerTreeTest(component.id)
        //     const rootLayer = await Layer.find({parentID:null})
        //
        //
        //     const data = {
        //         name: 'insert layer in root layer',
        //         type: 'Box',
        //         cid:component.id,
        //         parentID:rootLayer.id,
        //         subLayerOrder:[rootLayer.subLayerOrder[0]],
        //         styles: 'styles'
        //     }
        //
        //     const res = await chai.request(server)
        //         .post('/api/layer')
        //         .type('form')
        //         .set(authKey, authHeader)
        //         .send(data)
        //     console.log(res.body)
        //     should.not.equal(res, null)
        //     res.should.have.status(200)
        //     data.type = data.type.toLowerCase()
        //     res.body.should.be.a('object').include(data)
        // })

        it('it should not POST a layer for not exist component', async () => {

            const randomId = mongoose.Types.ObjectId()
            const data = {
                name: 'layer name',
                type: 'Box',
                cid:randomId.toString(),
                parentID:null,
                subLayerOrder:[],
                styles: 'styles'
            }

            const res = await chai.request(server)
                .post('/api/layer')
                .type('form')
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(400)
            res.should.nested.have.property('body.message' , 'component is not exist')
        })

        it('it should not POST a layer for error layer type', async () => {

            const data = {
                name: 'layer name',
                type: 'errortype',
                cid:component.id,
                parentID:null,
                subLayerOrder:[],
                styles: 'styles'
            }

            const res = await chai.request(server)
                .post('/api/layer')
                .type('form')
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)

            res.should.have.status(500)

            res.should.nested.have.property('body.message').that.match(/^layer validation failed: type/)
        })
    })


    describe('/DELETE/:id layer', () => {
        it('it should DELETE a layer given the id, and sub layers', async () => {
            let layers = await createLayerTreeTest(component.id)
            let root = await Layer.findOne({parendID:null})
            let deleteId = root.subLayerOrder[0]
            const res = await chai.request(server)
                .delete(`/api/layer/${deleteId}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)

            res.should.have.status(200)
            res.body.should.have.property('isDelete').that.is.true

            let layer = await Layer.findById(deleteId)
            should.equal(layer , null)

            root = await Layer.findOne({parendID:null})
            root.should.property('subLayerOrder').is.a('array').lengthOf(1)

            layers = await Layer.find({})
            layers.should.be.lengthOf(4)


        })
        
        
    })


    describe('/PUT/:id layer', () => {
        it('it should UPDATE a layer given the id', async () => {
            let layer = await getLayerTest(file.id)
            const data = {
                name: 'layer name update',
                type: 'TeXt',
                cid:component.id,
                parentID:null,
                subLayerOrder:[],
                styles: 'styles update'
            }
            const res = await chai.request(server)
                .put(`/api/layer/${layer.id}`)
                .set(authKey, authHeader)
                .send(data)

            // console.log(res.body)
            should.not.equal(res, null)
            res.should.have.status(200)

            // res.body.should.include({
            //     name: data.name,
            //     cid: data.cid,
            //     parentID: data.parentID,
            //     styles: data.styles,
            //     type: data.type.toLowerCase()
            // })
            data.type = data.type.toLowerCase()
            res.body.should.deep.include(data)

        })


        // it('it should UPDATE a layer given the id , and sub layers', async () => {
        //     let layer = await createLayerTreeTest(file.id)
        //     let root = await Layer.findOne({parendID:null})
        //
        //     let updateId = root.subLayerOrder[0]
        //     const data = {
        //         name: 'layer name update',
        //         type: 'TeXt',
        //         cid:component.id,
        //         parentID:null,
        //         subLayerOrder:[root.id],
        //         styles: 'styles update'
        //     }
        //     const res = await chai.request(server)
        //         .put(`/api/layer/${updateId}`)
        //         .set(authKey, authHeader)
        //         .send(data)
        //
        //     should.not.equal(res, null)
        //     res.should.have.status(200)
        //
        //     res.body.should.include({
        //         name: data.name,
        //         cid: data.cid,
        //         parentID: data.parentID,
        //         styles: data.styles,
        //         type: data.type.toLowerCase()
        //     })
        // })
    })

})