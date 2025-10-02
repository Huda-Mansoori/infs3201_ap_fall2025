const DateFormat = require('dayjs')
const persistence = require('./persistence')


// Find photo by ID

async function findPhotoById(id) {
    const photos = await persistence.loadPhotos()
    const albums = await persistence.loadAlbums()
    const photo = photos.find(p => p.id === id)
    if (!photo) return null

    
    let formattedDate = DateFormat(photo.date).format("DD MMM YYYY") // format date

    
    let albumNames = []
    for (let albumId of photo.albums) {
        let album = albums.find(a => a.id === albumId)
        if (album) albumNames.push(album.name)
    }

    return {
        filename: photo.filename,
        title: photo.title,
        date: formattedDate,
        albums: albumNames,
        tags: photo.tags
    }
}


// Update photo

async function updatePhotoDetails(id, newTitle, newDesc) {
    const photos = await persistence.loadPhotos()
    const photo = photos.find(p => p.id === id)
    if (!photo) return false

    if (newTitle) photo.title = newTitle
    if (newDesc) photo.description = newDesc

    await persistence.savePhotos(photos)
    return true
}


// List photos in an album

async function listAlbumPhotos(albumName) {
    const photos = await persistence.loadPhotos()
    const albums = await persistence.loadAlbums()
    const album = albums.find(a => a.name.toLowerCase() === albumName.toLowerCase())
    if (!album) return null

    return photos.filter(p => p.albums.includes(album.id))
}

// Tag photo

async function tagPhoto(id, tag) {
    const photos = await persistence.loadPhotos()
    const photo = photos.find(p => p.id === id)
    if (!photo) return false

    if (!photo.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
        photo.tags.push(tag)
        await persistence.savePhotos(photos)
        return true
    }
    return false
}

module.exports = {
    findPhotoById,
    updatePhotoDetails,
    listAlbumPhotos,
    tagPhoto
}