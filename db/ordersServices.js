require('dotenv').config()
const {createAndUpdateAt} =require('./utils')
const { MongoClient, ObjectId } = require('mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'

const client = new MongoClient(MONGO_URI)



const order={
     product_id: "69",
     value: "10.0",
     gateway: "PayPal",
     delivered: false,
     created_at: "2019-12-25T15:09:13.000+00:00",
     updated_at: "2019-12-25T15:31:40.000+00:00",
     buyer_id:"1",
     seller_id:"1",
}


async function createOrder(orderObject) {
    createAndUpdateAt(orderObject,true)
    await client.connect()
    const db = client.db('LeBonCovid')
    const orders = db.collection('orders')
    await orders.insertOne(orderObject).then((e)=>console.log("New order created : "+e.ops[0]._id)).catch((e)=>console.log(e))
}

async function updateOrder(orderId, objectModif) {
    createAndUpdateAt(objectModif)
    await client.connect()
    const db = client.db('LeBonCovid')
    const orders = db.collection('orders')
    const order = await orders.updateOne({"_id": new ObjectId(orderId)}, {$set: objectModif})
    console.log(order);
    return order
}

async function getById(id) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('orders')
    const product = await products.findOne({"_id" :new ObjectId(id)})
    console.log(product);
    return product
}

//createOrder(order).catch()
//updateOrder("5fabc6d6fd4b9666f2e81fb8", {delivered: true}).catch()
//getById("5fabedf2bc49d302b46e31ba").then()