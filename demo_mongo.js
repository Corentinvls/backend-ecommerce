require('dotenv').config()
const { MongoClient } = require('mongodb')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/DaMovies'

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

main().catch()
