// HUDA MANSOORI
// 60304645
// ASSIGNMENT03

/**
 * persistence.js
 * ----------------
 * This file represents the Persistence Layer of the application.
 * It is responsible for all direct interactions with MongoDB.
 * 
 * Responsibilities:
 * - Establish connection with the MongoDB database
 * - Retrieve and update data from the 'albums' and 'photos' collections
 * 
 * Database Name: infs3201_fall2025
 * Collections Used:
 *   • albums
 *   • photos
 */

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://60304645:12class34@web2.0wcr6lw.mongodb.net/";
const client = new MongoClient(uri);
const DB_NAME = 'infs3201_fall2025';

let db;

/**
 * Connect to MongoDB and cache the db object for reuse.
 * Prevents reconnecting multiple times.
 * 
 * @returns {Promise<import('mongodb').Db>} MongoDB database instance.
 */
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

/**
 * Retrieve all album documents from the 'albums' collection.
 * 
 * @returns {Promise<Array>} Array of album documents.
 */
async function getAlbums() {
  const database = await connectDB();
  return database.collection('albums').find({}).toArray();
}

/**
 * Retrieve all photo documents from the 'photos' collection.
 * 
 * @returns {Promise<Array>} Array of photo documents.
 */
async function getPhotos() {
  const database = await connectDB();
  return database.collection('photos').find({}).toArray();
}

/**
 * Retrieve a specific photo by its numeric 'id' field.
 * 
 * @param {number} id - Photo ID (numeric).
 * @returns {Promise<Object|null>} The photo document or null if not found.
 */
async function getPhotoById(id) {
  const database = await connectDB();
  return database.collection('photos').findOne({ id: Number(id) });
}

/**
 * Retrieve all photos that belong to a specific album.
 * Filters photos whose 'albums' array contains the given albumId.
 * 
 * @param {number} albumId - Album ID (numeric).
 * @returns {Promise<Array>} Array of matching photo documents.
 */
async function getPhotosByAlbumId(albumId) {
  const database = await connectDB();
  return database.collection('photos').find({ albums: Number(albumId) }).toArray();
}

/**
 * Update the title and description of a specific photo by ID.
 * 
 * @param {number} id - Photo ID (numeric).
 * @param {string} title - New photo title.
 * @param {string} description - New photo description.
 * @returns {Promise<boolean>} True if the photo was successfully updated, false otherwise.
 */
async function updatePhotoById(id, title, description) {
  const database = await connectDB();
  const result = await database.collection('photos').updateOne(
    { id: Number(id) },
    { $set: { title: title, description: description } }
  );
  return result.modifiedCount > 0;
}

// Export all persistence functions
module.exports = {
  getAlbums,
  getPhotos,
  getPhotoById,
  getPhotosByAlbumId,
  updatePhotoById
};
