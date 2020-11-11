require('dotenv').config()
const {MongoClient, ObjectId} = require('mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'
const {createAndUpdateAt} = require('./utils')
const client = new MongoClient(MONGO_URI)


const product = {
    title: "chatte",
    description: "This is a _example_ description",
    price: "12.99",
    gateways: [
        "paypal",
        "bitcoin",
        "ethereum",
        "stripe"
    ],
    image_url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
    ratings: [],
    categories: [],
    type: 1,
    seller_id: "1"
}
const modif = {
    title: "couilles",
    description: "This is a couille",
    price: "69.99",
    gateways: [
        "en nature"
    ]
}

async function create(productObject) {
    createAndUpdateAt(productObject,true)
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    await products.insertOne(productObject).then((e) => console.log("New product created : " + e.ops[0].title)).catch((e) => console.log(e))
}

async function searchByTitle(title) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    const product = await products.find({title: {$regex: title}}).toArray()
    console.log(product);
    return product
}

async function getById(id) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    const product = await products.findOne({"_id": new ObjectId(id)})
    console.log(product);
    return product
}

async function list() {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    const product = await products.find().toArray()
    console.log(product);
    return product
}

async function update(id, objectModif) {
    console.log(objectModif);
    createAndUpdateAt(objectModif);
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    const product = await products.updateOne({"_id":  new ObjectId(id)}, {$set: objectModif})
    console.log(product);
    return product
}


//reate(product).catch()

//searchByTitle("te").then()
//getById("5fabe7ae0f1b606b18b11341").then()

//listProducts().catch()

//update("5fabeb5ef490db6ba6896087",modif).then()
