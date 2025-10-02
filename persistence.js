const fs = require('fs/promises');

async function loadPhoto() {
    try {
        const data = await fs.readFile('photos.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading photos.json:", err.message);
        return [];
    }
}

async function writePhoto(data) {
    try {
        await fs.writeFile('photos.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing photos.json:", err.message);
    }
}

async function loadAlbum() {
    try {
        const data = await fs.readFile('albums.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading albums.json:", err.message);
        return [];
    }
}

async function writeAlbum(data) {
    try {
        await fs.writeFile('albums.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing albums.json:", err.message);
    }
}

module.exports = { loadPhoto, writePhoto, loadAlbum, writeAlbum };
