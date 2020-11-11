require('dotenv').config()
const { MongoClient } = require('mongodb')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/LeBonCovid'

const client = new MongoClient(MONGO_URI)

async function main() {
    await client.connect() // on se connecte au serveur mongo
    const db = client.db('DaMovies') // use DaMovies

    // const coll_list = await db.collections()
    // console.log({ colls: coll_list[0].s })

    const movies = db.collection('movies')
    // ne pas oublier le .toArray() quand on .find une collection
    const artistOrScientist = await db.collection('users').findOne({ occupation: { $in: ['artist', 'scientist'] } })
    console.log(artistOrScientist)

}
async function createProduct(productObject) {
    await client.connect() // on se connecte au serveur mongo
    const db = client.db('LeBonCovid') // use DaMovies
    const products = db.collection('products')
    // ne pas oublier le .toArray() quand on .find une collection
   await products.insertOne({
        title: "Example Product",
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
    })

}

createProduct().catch()

