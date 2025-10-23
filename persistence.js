// persistence.js
const fs = require('fs/promises');

/**
 * Load all photos from photos.json
 * @returns {Promise<Array>}
 */
async function loadPhotos() {
    try {
        const data = await fs.readFile('photos.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading photos.json:", err.message);
        return [];
    }
}

/**
 * Save photos to photos.json
 * @param {Array} photos
 */
async function savePhotos(photos) {
    try {
        await fs.writeFile('photos.json', JSON.stringify(photos, null, 2));
    } catch (err) {
        console.error("Error writing photos.json:", err.message);
    }
}

/**
 * Load albums from albums.json
 * @returns {Promise<Array>}
 */
async function loadAlbums() {
    try {
        const data = await fs.readFile('albums.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading albums.json:", err.message);
        return [];
    }
}

module.exports = { loadPhotos, savePhotos, loadAlbums };
