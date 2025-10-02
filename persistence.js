// Huda Mansoori
// 60304645
// Assignment 02

const fs = require('fs/promises');

/**
 * Loads photo data from 'photos.json'.
 * @returns {Promise<Array<Object>>} Returns an array of photo objects, or an empty array if file cannot be read.
 */

async function loadPhoto() {
    try {
        const data = await fs.readFile('photos.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading photos.json:", err.message);
        return [];
    }
}

/**
 * Writes photo data to 'photos.json'.
 * @param {Array<Object>} data - The array of photo objects to write.
 * @returns {Promise<void>}
 */

async function writePhoto(data) {
    try {
        await fs.writeFile('photos.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing photos.json:", err.message);
    }
}

/**
 * Loads album data from 'albums.json'.
 * @returns {Promise<Array<Object>>} Returns an array of album objects, or an empty array if file cannot be read.
 */

async function loadAlbum() {
    try {
        const data = await fs.readFile('albums.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading albums.json:", err.message);
        return [];
    }
}

/**
 * Writes album data to 'albums.json'.
 * @param {Array<Object>} data - The array of album objects to write.
 * @returns {Promise<void>}
 */

async function writeAlbum(data) {
    try {
        await fs.writeFile('albums.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing albums.json:", err.message);
    }
}

/**
 * Loads user data from 'users.json'.
 * @returns {Promise<Array<Object>>} Returns an array of user objects, or an empty array if file cannot be read.
 */

async function loadUsers() {
    try {
        const data = await fs.readFile('users.json', 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        console.error("Error reading users.json:", err.message)
        return []
    }
}



module.exports = { loadPhoto, writePhoto, loadAlbum, writeAlbum, loadUsers };