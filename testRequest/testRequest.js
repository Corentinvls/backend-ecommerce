require('dotenv').config()
const crypto = require('crypto')
const {MongoClient, ObjectId} = require('mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'
const {createAndUpdateAt} = require('../db/utils')
const client = new MongoClient(MONGO_URI)
const bcrypt = require('bcrypt')


const product = {
    title: "TEST",
    description: "This is a TEST description",
    price: 10.99,
    ref: "AZERTY19COVID",
    gateways: [
        "paypal",
        "bitcoin",
        "ethereum",
        "stripe"
    ],
    image_url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
    ratings: [{rating: 2, pseudo: "franky", comment: "that's weird"}],
    categories: ["rpg"],
    type: "service",
    seller_pseudo: "jackylamoule",
    add_to_cart: 0,
    sells: 0

}
const user = {
    lastname: "Bidden",
    firstname: "joe",
    pseudo: "usaFever",
    password: 'fuckTrump',
    email: 'usa@gmail.com',
    group: [
        'seller',
        'buyer',
    ],
    order: [
        new ObjectId('5fae3a715cb4d1a92a90b7f2'),
        'sample',
        'cccccccc'
    ],
    products: [],
    products_sells: [],
    cart: [],
    money_earn: 0,
    money_spend: 0,
    money: 10000000000,
    avatar: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
}
const modif = {
    order: [
        'sample2',
        'sample',
        'sample3'
    ],
}

const toPush = {
    ratings: {rating: 2}
}

async function createUser(user) {
    createAndUpdateAt(user, true)
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection("users")
    const saltRounds = 10;
    const password = user.password
    await bcrypt.hash(password, saltRounds, (err, hash) => {
        user.password = hash
        dbPath.insertOne(user).then((e) => console.log("New user created : " + e.ops[0]._id)).catch((e) => console.log(e))
    })
}

async function logUser(username, password) {
    //... fetch user from a db etc.
    let passwordHash = await findUserPassword(username)
    const match = await bcrypt.compare(password, passwordHash);
    if (match) {
        console.log("cest le bon pass")
        const token = crypto.randomBytes(40).toString('hex')
        console.log({success: true, token})
    } else {
        console.log("FAUX")
    }

    //...
}

async function create(collection, object) {
    createAndUpdateAt(object, true)
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    await dbPath.insertOne(object).then((e) => console.log("New " + collection + " created : " + e.ops[0]._id)).catch((e) => console.log(e))
}


async function searchBy(collection, field, search) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    var query = {};
    query[field] = {$regex: search};
    const result = await dbPath.find(query).toArray()
    console.log(result);
    return result
}

async function checkIfUserExist(field, search) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection("users")
    var query = {};
    query[field] = search;
    const result = await dbPath.findOne(query)
    console.log(result !== null);
    return result !== null
}

async function findUserPassword(search) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection("users")
    const result = await dbPath.findOne({$or: [{email: search}, {pseudo: search}]})
    return result.password
}

async function getById(collection, id) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    console.log(id)
    const result = await dbPath.findOne({"_id": new ObjectId(id)})
    console.log(result);
    return result

}
async function getBy(collection, field, search){
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    var query = {};
    query[field] = search;
    const result = await dbPath.find(query).toArray()
    console.log(result)
}

async function list(collection) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    const result = await dbPath.find().toArray()
    console.log(result);
    return result
}

async function listOfOrdersProducts(id, sort) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection('users')
    const result = await
        dbPath.aggregate([
            {$unwind: '$order'},
            {$match: {"_id": new ObjectId(id)}},
            {
                $lookup: {
                    from: 'products',
                    localField: 'order',
                    foreignField: 'title',
                    as: 'infoList'
                }
            },
            {$unwind: '$infoList'},
            {
                $project: {
                    order: 1,
                    _id: 0,
                    infoList: {title: 1, description: 1, price: 1, ref: 1, image_url: 1, categories: 1, type: 1}
                }
            },
            {$sort: {order: sort}}
        ]).toArray()
    console.log(result)
    return result
}

async function showDistinct(collection,element){
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    const result = await dbPath.distinct(element)
    console.log(result)
}

async function showProductsByCategorie(categorie) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection('products')
    const result = await
         dbPath.find({categories: categorie}).toArray()
    console.log(result)
}

async function update(collection, id, objectModif) {
    createAndUpdateAt(objectModif);
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    await dbPath.updateOne({"_id": new ObjectId(id)}, {$set: objectModif}).then((e) => console.log(e.result)).catch((e) => console.log(e))
}

async function push(collection, id, objectModif) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const dbPath = db.collection(collection)
    await dbPath.updateOne({_id: new ObjectId(id)}, {
        $set: {"updatedAt": new Date()},
        $push: objectModif
    }).then((e) => console.log(e.result)).catch((e) => console.log(e))
}


// create("products",product).catch()
//checkIfUserExist("email","usa@gmail.co").catch()
//searchBy("products","title","te").then()
//getById("products","5fabf9df51b7ba6e5191580e").then()

// list("products").catch()

// listOfOrdersProducts('5fae3a60035237a923dbc55d', -1).then()

// update("users","5fae3a60035237a923dbc55d",modif).then()

//push("products","5fabfbce9f2d076e94e1819d",toPush).then()

// logUser("zef", "Azerty1").then( )

// showProductsByCategorie('adventure')
// showDistinct('products','title')
getBy('products','type','service')

exports.create = create
exports.createUser = createUser
exports.searchBy = searchBy
exports.getById = getById
exports.list = list
exports.update = update
exports.push = push
exports.checkIfUserExist = checkIfUserExist
exports.logUser = logUser
