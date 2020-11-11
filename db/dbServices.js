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

const toPush = {
    ratings:{rating:5,}
}

async function create(collection,object) {
    createAndUpdateAt(object,true)
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    await dbPath.insertOne(object).then((e) => console.log("New "+collection+" created : " + e.ops[0]._id)).catch((e) => console.log(e))
}

async function searchBy(collection,field,search) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    var query = {};
    query[field] = {$regex: search};
    const result= await dbPath.find(query).toArray()
    console.log(result);
    return result
}

async function getById(collection,id) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    const result= await dbPath.findOne({"_id": new ObjectId(id)})
    console.log(result);
    return result

}

async function list(collection) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    const result= await dbPath.find().toArray()
    console.log(result);
    return result
}

async function update(collection,id, objectModif) {
    createAndUpdateAt(objectModif);
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    await dbPath.updateOne({"_id":  new ObjectId(id)}, {$set: objectModif}).then((e) => console.log(e.result)).catch((e) => console.log(e))
}
async function push(collection,id, objectModif) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    await dbPath.updateOne({_id:  new ObjectId(id)}, {$set:{"updatedAt":new Date()},$push: objectModif}).then((e) => console.log(e.result)).catch((e) => console.log(e))
}



//create("products",product).catch()

//searchBy("products","title","te").then()
//getById("products","5fabf9df51b7ba6e5191580e").then()

//list("products").catch()

//update("products","5fabfbce9f2d076e94e1819d",modif).then()

//push("products","5fabfbce9f2d076e94e1819d",toPush).then()