// Huda Mansoori
// 60304645
// Assignment 03


const DateFormat = require('dayjs');
const persistence = require('./persistence');

/**
 * Finds a photo by its ID and checks if the user is authorized to view it.
 * @param {string} id - The ID of the photo to find.
 * @param {string} userId - The ID of the user requesting the photo.
 * @returns {Promise<Object|string|null>} Returns photo details if authorized, 'unauthorized' if the user doesn't own the photo, or null if the photo is not found.
 */

async function findPhotoById(id, userId) {
    const photos = await persistence.loadPhoto();
    const albums = await persistence.loadAlbum();

    let photo = photos.find(p => p.id === id);
    if (!photo) return null;
    if (photo.owner !== userId) return 'unauthorized';

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
 * Updates the title and/or description of a photo if the user is authorized.
 * @param {string} id - The ID of the photo to update.
 * @param {string} newTitle - The new title for the photo (leave empty to keep current).
 * @param {string} newDesc - The new description for the photo (leave empty to keep current).
 * @param {string} userId - The ID of the user making the update.
 * @returns {Promise<boolean|string>} Returns true if update is successful, 'unauthorized' if the user does not own the photo, or false if the photo is not found.
 */

async function updatePhotoDetails(id, newTitle, newDesc, userId) {
    const photos = await persistence.loadPhoto();
    let photo = photos.find(p => p.id === id);
    if (!photo) return false;
    if (photo.owner !== userId) return 'unauthorized';

    if (newTitle !== "") photo.title = newTitle;
    if (newDesc !== "") photo.description = newDesc;

    await persistence.writePhoto(photos);
    return true;
}


/**
 * Lists all photos in a specified album.
 * @param {string} albumName - The name of the album.
 * @returns {Promise<Array<Object>|null>} Returns an array of photo objects containing filename, resolution, and tags, or null if album is not found.
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
 * Adds a tag to a photo if the user is authorized and tag doesn't already exist.
 * @param {string} id - The ID of the photo to tag.
 * @param {string} tag - The tag to add.
 * @param {string} userId - The ID of the user adding the tag.
 * @returns {Promise<string>} Returns 'added' if tag is added, 'unauthorized' if user doesn't own the photo, 'not found' if photo doesn't exist, 'empty' if tag is empty, or 'exists' if tag already exists.
 */

async function tagPhoto(id, tag, userId) {
    const photos = await persistence.loadPhoto();
    let photo = photos.find(p => p.id === id);
    if (!photo) return 'not found';
    if (photo.owner !== userId) return 'unauthorized';
    if (!tag) return 'empty';
    if (photo.tags.some(t => t.toLowerCase() === tag.toLowerCase())) return 'exists';

    photo.tags.push(tag);
    await persistence.writePhoto(photos);
    return 'added';
}

/**
 * Logs in a user by matching username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object|null>} Returns the user object if login is successful, or null if login fails.
 */

async function login(username, password) {
    const users = await persistence.loadUsers()
    for (let user of users) {
        if (user.username === username && user.password === password) {
            return user  // login successful
        }
    }
    return null  // login failed
}

module.exports = { findPhotoById, updatePhotoDetails, listAlbumPhotos, tagPhoto, login };