require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'
const {createAndUpdateAt} =require('./utils')


const client = new MongoClient(MONGO_URI)

const user={
    lastname: "Boe",
    firstname: "John",
    password:'coucou',
    email:'test@gmail.com',
    age:'20',
    group: [
        'seller',
        'buyer',
    ],
    order:[
        '5fabc6d6fd4b9666f2e81fb8',
    ],
    money: 100,
    avatar:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
}

const modif = {
    lastname: "Boe2",
    firstname: "John",
    group: [
        "seller"
    ]
}


async function create(userObject) {
    createAndUpdateAt(userObject,true)
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('users')
    await products.insertOne(userObject).then((e) => console.log("New product created : " + e.ops[0].lastname)).catch((e) => console.log(e))
}

async function update(id, objectModif) {
    console.log(objectModif);
    createAndUpdateAt(objectModif);
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('users')
    const product = await products.updateOne({"_id":  new ObjectId(id)}, {$set: objectModif})
    console.log(product);
    return product
}

async function searchByName(lastname) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('users')
    const product = await products.find({lastname:{ $regex: lastname }}).toArray()
    console.log(product);
    return product
}

async function t(){
    await client.connect()

}

async function getById(id) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('users')
    const product = await products.findOne({"_id" :new ObjectId("5fabe2ad37798f6fca7adf05")})
    console.log(product);
    return product
}

// create(user).catch()
// update('5fabedc642e57e7127f62bd0',modif).catch()
searchByName("B").then()

// getById("5fabc6d6fd4b9666f2e81fb8").then()
