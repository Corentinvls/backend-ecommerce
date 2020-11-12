require('dotenv').config()
const {MongoClient, ObjectId} = require('mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'
const {createAndUpdateAt} = require('./utils')
const client = new MongoClient(MONGO_URI)
const bcrypt = require('bcrypt')


function hashPassword(password) {
    // const hash = crypto.createHash('sha256',password)
    // // hash.update(password)
    // console.log(password)
    // return hash.digest('hex')


}


const product = {
    title: "chatte",
    description: "This is a _example_ description",
    price: 12.99,
    ref:"AZERTY19COVID",
    gateways: [
        "paypal",
        "bitcoin",
        "ethereum",
        "stripe"
    ],
    image_url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
    ratings: [{rating:2,pseudo:"franky",comment:"that's weird"}],
    categories: ["adventure","rpg"],
    type: "game",
    seller_pseudo: "jackylamoule",
    add_to_cart:0,
    sells:0

}
const user={
    lastname: "Bidden",
    firstname: "Joe",
    pseudo:"usaFever",
    password:'fuckTrump',
    email:'usa@gmail.com',
    group: [
        'seller',
        'buyer',
    ],
    order:[],
    products:[],
    products_sells:[],
    cart:[],
    money_earn:0,
    money_spend:0,
    money: 10000000000,
    avatar:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
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
    ratings:{rating:2}
}
async function createUser(object) {
    createAndUpdateAt(object, true)
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection("users")
    const saltRounds = 10;
    const password = object.password
    await bcrypt.hash(password, saltRounds, (err, hash) => {
        object.password = hash
        dbPath.insertOne(object).then((e) => console.log("New user created : " + e.ops[0]._id)).catch((e) => console.log(e))
    })

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
async function checkIfUserExist(field,search) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection("users")
    var query = {};
    query[field] =  search;
    const result= await dbPath.findOne(query)
    console.log(result !== null);
    return result !== null
}

async function getById(collection,id) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    console.log(id)
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



//create("users",user).catch()
checkIfUserExist("email","usa@gmail.co").catch()
//searchBy("products","title","te").then()
//getById("products","5fabf9df51b7ba6e5191580e").then()

//list("products").catch()

//update("products","5fabfbce9f2d076e94e1819d",modif).then()

//push("products","5fabfbce9f2d076e94e1819d",toPush).then()

exports.create=create
exports.createUser=createUser
exports.searchBy=searchBy
exports.getById=getById
exports.list=list
exports.update=update
exports.push=push
exports.checkIfUserExist=checkIfUserExist