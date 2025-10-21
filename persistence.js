// Huda Mansoori
// 60304645
// Assignment 03

const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://60304645:12class34@web2.0wcr6lw.mongodb.net/";
const client = new MongoClient(uri);
const dbName = "infs3201_fall2025";

let db;

// Connect once and reuse the connection
async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
        console.log("✅ Connected to MongoDB!");
    }
    return db;
}

async function loadPhoto() {
    const database = await connectDB();
    return database.collection("photos").find({}).toArray();
}

async function writePhoto(id, updateData) {
    const database = await connectDB();
    const result = await database.collection("photos").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
    return result.modifiedCount > 0;
}

async function loadAlbum() {
    const database = await connectDB();
    return database.collection("albums").find({}).toArray();
}

async function writeAlbum(id, updateData) {
    const database = await connectDB();
    const result = await database.collection("albums").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
    return result.modifiedCount > 0;
}

module.exports = { loadPhoto, writePhoto, loadAlbum, writeAlbum };
