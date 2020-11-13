require('dotenv').config()

const {MongoClient, ObjectId} = require('mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'
const {createAndUpdateAt} = require('./utils')
const client = new MongoClient(MONGO_URI)
const bcrypt = require('bcrypt')
const crypto = require('crypto')


async function getConnection() {
    await client.connect()
    return client.db('LeBonCovid')
}

async function createUser(user) {
    createAndUpdateAt(user, true)
    const db = await getConnection()
    const dbPath = db.collection("users")
    const saltRounds = 10;
    const password = user.password
    await bcrypt.hash(password, saltRounds, (err, hash) => {
        user.password = hash
        dbPath.insertOne(user).then((e) => console.log("New user created : " + e.ops[0]._id)).catch((e) => console.log(e))
    })
}

async function getBy(collection, field, search) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    var query = {};
    query[field] = search;
    const result = await dbPath.find(query).toArray()
    console.log(result)
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
}

async function create(collection, object) {
    createAndUpdateAt(object, true)
    const db = await getConnection()
    const dbPath = db.collection(collection)
    await dbPath.insertOne(object).then((e) => console.log("New " + collection + " created : " + e.ops[0]._id)).catch((e) => console.log(e))
}

async function searchBy(collection, field, search) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    var query = {};
    query[field] = {$regex: search};
    const result = await dbPath.find(query).toArray()
    console.log(result);
    return result
}

async function checkIfUserExist(field, search) {
    const db = await getConnection()
    const dbPath = db.collection("users")
    var query = {};
    query[field] = search;
    const result = await dbPath.findOne(query)
    console.log(result !== null);
    return result !== null
}

async function findUserPassword(search) {
    const db = await getConnection()
    const dbPath = db.collection("users")
    const result = await dbPath.findOne({$or: [{email: search}, {pseudo: search}]})
    return result.password
}

async function getById(collection, id) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    console.log(id)
    const result = await dbPath.findOne({"_id": new ObjectId(id)})
    console.log(result);
    return result

}

async function list(collection) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    const result = await dbPath.find().toArray()
    console.log(result);
    return result
}

async function update(collection, id, objectModif) {
    createAndUpdateAt(objectModif);
    const db = await getConnection()
    const dbPath = db.collection(collection)
    await dbPath.updateOne({"_id": new ObjectId(id)}, {$set: objectModif}).then((e) => console.log(e.result)).catch((e) => console.log(e))
}

async function increment(collection, id, objectModif) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    await dbPath.updateOne({"_id": new ObjectId(id)}, {
        $set: {"updatedAt": new Date()},
        $inc: objectModif
    }).then((e) => console.log(e.result)).catch((e) => console.log(e))
}

async function remove(collection, id) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    await dbPath.deleteOne({"_id": new ObjectId(id)})
}

async function push(collection, id, objectModif) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    await dbPath.updateOne({_id: new ObjectId(id)}, {
        $set: {"updatedAt": new Date()},
        $push: objectModif
    }).then((e) => console.log(e.result)).catch((e) => console.log(e))
}

async function filterLTEPrice(collection,filter){
    const db = await getConnection()
    const dbPath = db.collection(collection)
    return await dbPath.find({"price":{$lte : filter}}).toArray()
}




async function listOfOrdersProducts(id, sort) {
    const db = await getConnection()
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

async function showDistinct(collection, element) {
    const db = await getConnection()
    const dbPath = db.collection(collection)
    const result = await dbPath.distinct(element)
    console.log(result)
}

async function showProductsByCategorie(categorie) {
    const db = await getConnection()
    const dbPath = db.collection('products')
    const result = await
        dbPath.find({categories: categorie}).toArray()
    console.log(result)
}


//create("users",user).catch()
//checkIfUserExist("email","usa@gmail.co").catch()
//searchBy("products","title","te").then()
//getById("products","5fabf9df51b7ba6e5191580e").then()

//list("products").catch()

//update("products","5fabfbce9f2d076e94e1819d",modif).then()

//push("products","5fabfbce9f2d076e94e1819d",toPush).then()

//remove("users","5fad57dd21a816b625d97b0e").then()

//logUser("zef", "Azerty1").then( )

// showProductsByCategorie('adventure')

// showDistinct('products','title')

//getBy('products','type','service')

//filterPrice("products",10).catch()

exports.create = create
exports.createUser = createUser
exports.searchBy = searchBy
exports.getById = getById
exports.list = list
exports.update = update
exports.push = push
exports.checkIfUserExist = checkIfUserExist
exports.logUser = logUser
exports.remove = remove
exports.increment = increment

exports.getBy = getBy
exports.showProductsByCategorie =showProductsByCategorie
exports.showDistinct =showDistinct
exports.listOfOrdersProducts=listOfOrdersProducts
exports.filterLTEPrice=filterLTEPrice