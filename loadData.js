// HUDA MANSOORI
// 60304645
// ASSIGNMENT03


/**
 * dataLoader.js
 * ----------------
 * This script is responsible for seeding the MongoDB database
 * with initial data from local JSON files.
 * 
 * Responsibilities:
 * - Connect to the MongoDB cluster
 * - Read and parse JSON data from files (albums.json, photos.json)
 * - Insert parsed data into MongoDB collections
 * - Replace any existing data in the collections
 * 
 * Database Name: infs3201_fall2025
 * Collections Loaded:
 *   • albums
 *   • photos
 */

const fs = require('fs/promises');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://60304645:12class34@web2.0wcr6lw.mongodb.net/";
const client = new MongoClient(uri);
const DB_NAME = 'infs3201_fall2025';

/**
 * Load a JSON file and insert its contents into the specified MongoDB collection.
 * 
 * Steps:
 * 1. Read JSON file from disk
 * 2. Parse data into JavaScript objects
 * 3. Delete existing documents in the collection
 * 4. Insert new documents from the JSON array
 * 
 * @param {string} collectionName - Name of the MongoDB collection to update.
 * @param {string} filename - Path to the JSON file containing the data.
 */
async function loadCollectionFromFile(collectionName, filename) {
  const dataRaw = await fs.readFile(filename, 'utf8');
  const arr = JSON.parse(dataRaw);
  const db = client.db(DB_NAME);
  const col = db.collection(collectionName);
  await col.deleteMany({});
  if (arr.length) await col.insertMany(arr);
  console.log(`Loaded ${arr.length} documents into ${collectionName}`);
}

/**
 * Main entry point for the data loading script.
 * 
 * Connects to MongoDB, calls loadCollectionFromFile() for each collection,
 * and closes the connection when finished or upon error.
 */
async function main() {
  try {
    await client.connect();
    await loadCollectionFromFile('albums', 'data/albums.json');
    await loadCollectionFromFile('photos', 'data/photos.json');
    console.log('Done loading data.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// Run the data loading process
main();
