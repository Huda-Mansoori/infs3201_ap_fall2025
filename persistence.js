const fs = require('fs/promises')


async function loadPhotos() {
    const data = await fs.readFile('photos.json', 'utf-8')
    return JSON.parse(data)
}

async function savePhotos(photos) {
    await fs.writeFile('photos.json', JSON.stringify(photos, null, 2))
}


async function loadAlbums() {
    const data = await fs.readFile('albums.json', 'utf-8')
    return JSON.parse(data)
}

module.exports = {
    loadPhotos,
    savePhotos,
    loadAlbums
}