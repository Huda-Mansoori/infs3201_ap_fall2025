// Huda Mansoori
// 60304645
// Assignment 03

const DateFormat = require('dayjs');
const persistence = require('./persistence');
const { ObjectId } = require('mongodb');

/**
 * Finds a photo by its ID.
 * @param {string} id - Photo ID (MongoDB _id)
 * @returns {Promise<Object|null>} Photo details or null if not found
 */
async function findPhotoById(id) {
    const photos = await persistence.loadPhoto();
    const albums = await persistence.loadAlbum();

    // Convert string id to ObjectId for MongoDB compatibility
    let photo = photos.find(p => p._id.toString() === id);
    if (!photo) return null;

    let formattedDate = DateFormat(photo.date).format("DD MMM YYYY");

    let albumNames = photo.albums.map(aid => {
        let album = albums.find(a => a._id.toString() === aid.toString());
        return album ? album.name : '';
    });

    return {
        id: photo._id.toString(),
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
async function updatePhotoDetails(id, newTitle, newDesc) {
    const photo = await findPhotoById(id);
    if (!photo) return false;

    const updatedData = {};
    if (newTitle !== "") updatedData.title = newTitle;
    if (newDesc !== "") updatedData.description = newDesc;

    const result = await persistence.writePhoto(id, updatedData);
    return result;
}

/**
 * List all photos in an album
 */
async function listAlbumPhotos(albumName) {
    const photos = await persistence.loadPhoto();
    const albums = await persistence.loadAlbum();

    const album = albums.find(a => a.name.toLowerCase() === albumName.toLowerCase());
    if (!album) return null;

    return photos.filter(p => p.albums.includes(album._id.toString()))
                 .map(p => ({
                     id: p._id.toString(),
                     filename: p.filename,
                     resolution: p.resolution,
                     tags: p.tags.join(':')
                 }));
}

/**
 * Adds a tag to a photo
 */
async function tagPhoto(id, tag) {
    const photos = await persistence.loadPhoto();
    let photo = photos.find(p => p._id.toString() === id);
    if (!photo) return 'not found';
    if (!tag) return 'empty';
    if (photo.tags.some(t => t.toLowerCase() === tag.toLowerCase())) return 'exists';

    const updatedData = { tags: [...photo.tags, tag] };
    const result = await persistence.writePhoto(id, updatedData);
    return result ? 'added' : 'not found';
}

module.exports = { findPhotoById, updatePhotoDetails, listAlbumPhotos, tagPhoto };
