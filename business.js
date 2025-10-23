// HUDA MANSOORI
// 60304645
// ASSIGNMENT 03

// business.js
const DateFormat = require('dayjs');
const persistence = require('./persistence');

/**
 * Find a photo by ID
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function findPhotoById(id) {
    const photos = await persistence.loadPhotos();
    const albums = await persistence.loadAlbums();

    const photo = photos.find(p => p.id === id);
    if (!photo) return null;

    const formattedDate = DateFormat(photo.date).format("DD MMM YYYY");

    const albumNames = photo.albums.map(aid => {
        const album = albums.find(a => a.id === aid);
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
 * Update photo details
 * @param {number} id
 * @param {string} newTitle
 * @param {string} newDesc
 * @returns {Promise<boolean>}
 */
async function updatePhotoDetails(id, newTitle, newDesc) {
    const photos = await persistence.loadPhotos();
    const photo = photos.find(p => p.id === id);
    if (!photo) return false;

    if (newTitle !== "") photo.title = newTitle;
    if (newDesc !== "") photo.description = newDesc;

    await persistence.savePhotos(photos);
    return true;
}

/**
 * List all photos in an album
 * @param {string} albumName
 * @returns {Promise<Array|null>}
 */
async function listAlbumPhotos(albumName) {
    const photos = await persistence.loadPhotos();
    const albums = await persistence.loadAlbums();

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
 * Add a tag to a photo
 * @param {number} id
 * @param {string} tag
 * @returns {Promise<string>}
 */
async function tagPhoto(id, tag) {
    const photos = await persistence.loadPhotos();
    const photo = photos.find(p => p.id === id);
    if (!photo) return 'not found';
    if (!tag) return 'empty';
    if (photo.tags.some(t => t.toLowerCase() === tag.toLowerCase())) return 'exists';

    photo.tags.push(tag);
    await persistence.savePhotos(photos);
    return 'added';
}

module.exports = { findPhotoById, updatePhotoDetails, listAlbumPhotos, tagPhoto };
