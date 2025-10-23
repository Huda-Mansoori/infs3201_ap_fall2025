const fs = require('fs/promises');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://60304645:12class34@web2.0wcr6lw.mongodb.net/";
const client = new MongoClient(uri);
const dbName = "infs3201_fall2025";

async function loadData() {
    await client.connect();
    const db = client.db(dbName);

    // Load albums
    const albumsData = JSON.parse(await fs.readFile('albums.json', 'utf-8'));
    const albumsCollection = db.collection('albums');
    await albumsCollection.deleteMany({});
    await albumsCollection.insertMany(albumsData);
    console.log('Albums loaded');

    // Load photos
    const photosData = JSON.parse(await fs.readFile('photos.json', 'utf-8'));
    const photosCollection = db.collection('photos');
    await photosCollection.deleteMany({});
    await photosCollection.insertMany(photosData);
    console.log('Photos loaded');

    await client.close();
}

loadData().catch(console.error);
