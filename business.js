// Huda Mansoori
// 60304645
// Assignment 03


const DateFormat = require('dayjs');
const persistence = require('./persistence');

/**
 * Finds a photo by its ID.
 * @param {string} id - Photo ID
 * @param {string} userId - ID of the user (still required for owner checks)
 * @returns {Promise<Object|string|null>} Photo details or null/unauthorized
 */
async function findPhotoById(id, userId) {
    const photos = await persistence.loadPhoto();
    const albums = await persistence.loadAlbum();

    let photo = photos.find(p => p.id === id);
    if (!photo) return null;

    let formattedDate = DateFormat(photo.date).format("DD MMM YYYY");

    let albumNames = photo.albums.map(aid => {
        let album = albums.find(a => a.id === aid);
        return album ? album.name : '';
    });

    return {
        filename: photo.filename,
        title: photo.title,
        description: photo.description,
        date: formattedDate,
        albums: albumNames,
        tags: photo.tags
    };
}

/**
 * Updates title/description of a photo
 */
async function updatePhotoDetails(id, newTitle, newDesc, userId) {
    const photos = await persistence.loadPhoto();
    let photo = photos.find(p => p.id === id);
    if (!photo) return false;

    if (newTitle !== "") photo.title = newTitle;
    if (newDesc !== "") photo.description = newDesc;

    await persistence.writePhoto(photos);
    return true;
}

/**
 * List all photos in an album
 */
async function listAlbumPhotos(albumName) {
    const photos = await persistence.loadPhoto();
    const albums = await persistence.loadAlbum();

    const album = albums.find(a => a.name.toLowerCase() === albumName.toLowerCase());
    if (!album) return null;

    return photos.filter(p => p.albums.includes(album.id))
                 .map(p => ({
                     filename: p.filename,
                     resolution: p.resolution,
                     tags: p.tags.join(':')
                 }));
}

/**
 * Adds a tag to a photo
 */
async function tagPhoto(id, tag, userId) {
    const photos = await persistence.loadPhoto();
    let photo = photos.find(p => p.id === id);
    if (!photo) return 'not found';
    if (!tag) return 'empty';
    if (photo.tags.some(t => t.toLowerCase() === tag.toLowerCase())) return 'exists';

    photo.tags.push(tag);
    await persistence.writePhoto(photos);
    return 'added';
}

module.exports = { findPhotoById, updatePhotoDetails, listAlbumPhotos, tagPhoto };
