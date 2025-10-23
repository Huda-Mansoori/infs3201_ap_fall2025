// HUDA MANSOORI
// 60304645
// ASSIGNMENT03

/**
 * business.js
 * ----------------
 * This module acts as the **business logic layer** for the photo album application.
 * 
 * Responsibilities:
 * - Acts as an intermediary between the persistence (database) layer and presentation/UI layer.
 * - Handles data retrieval, validation, transformation, and formatting before sending data to the user interface.
 * - Delegates low-level data operations (CRUD) to persistence.js.
 * 
 * Dependencies:
 * - persistence.js → Handles database operations.
 * - dayjs → Used for formatting dates into a readable format.
 */

const persistence = require('./persistence');
const dayjs = require('dayjs');

/**
 * Load all albums from the database.
 * 
 * @returns {Promise<Array>} Array of album documents.
 */
async function loadAlbums() {
  return persistence.getAlbums();
}

/**
 * Load all photos from the database.
 * 
 * @returns {Promise<Array>} Array of photo documents.
 */
async function loadPhotos() {
  return persistence.getPhotos();
}

/**
 * Retrieve a single photo by its ID and format the date for display.
 * 
 * Enhancements:
 * - Converts the stored ISO date into a more user-friendly format (e.g., "15 Dec 2024").
 * 
 * @param {number} id - The photo’s numeric ID.
 * @returns {Promise<Object|null>} A formatted photo object or null if not found.
 */
async function getPhoto(id) {
  const photo = await persistence.getPhotoById(Number(id));
  if (!photo) return null;

  // Format date for display (e.g., 15 Dec 2024)
  let formattedDate = null;
  if (photo.date) {
    try {
      formattedDate = dayjs(photo.date).format('DD MMM YYYY');
    } catch (e) {
      formattedDate = photo.date;
    }
  }

  return Object.assign({}, photo, { formattedDate });
}

/**
 * Get all photos belonging to a specific album by album ID.
 * 
 * @param {number} albumId - Album’s numeric ID.
 * @returns {Promise<Array>} Array of photo documents.
 */
async function getPhotosForAlbum(albumId) {
  return persistence.getPhotosByAlbumId(Number(albumId));
}

/**
 * Update the title and description of a specific photo.
 * 
 * @param {number} id - Photo’s numeric ID.
 * @param {string} title - New title.
 * @param {string} description - New description.
 * @returns {Promise<boolean>} True if the photo was updated successfully, otherwise false.
 */
async function updatePhoto(id, title, description) {
  return persistence.updatePhotoById(Number(id), title, description);
}

module.exports = {
  loadAlbums,
  loadPhotos,
  getPhoto,
  getPhotosForAlbum,
  updatePhoto
};
