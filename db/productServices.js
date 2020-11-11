require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'

const client = new MongoClient(MONGO_URI)



const product={
   title: "chatte",
       description: "This is a _example_ description",
       price: "12.99",
       gateways: [
       "paypal",
       "bitcoin",
       "ethereum",
       "stripe"
   ],
       image_url:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
       ratings:[],
       seller_id: "1"
}


async function createProduct(productObject) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    await products.insertOne(productObject).then((e)=>console.log("New product created : "+e.ops[0].title)).catch((e)=>console.log(e))
}

async function searchByTitle(title) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    const product = await products.find({title:{ $regex: title }}).toArray()
    console.log(product);
    return product
}

async function getById(id) {
    await client.connect()
    const db = client.db('LeBonCovid')
    const products = db.collection('products')
    const product = await products.findOne({"_id" :new ObjectId("5fabc6d6fd4b9666f2e81fb8")})
    console.log(product);
    return product
}

//createProduct(product).catch()

//searchByTitle("te").then()

getById("5fabc6d6fd4b9666f2e81fb8").then()