// HUDA MANSOORI
// 60304645
// ASSIGNMENT03


/**
 * app.js
 * ----------------
 * This file serves as the **presentation layer** for the Photo Management App.
 * 
 * Purpose:
 * - Provides a web interface using Express.js and Handlebars (hbs templates).
 * - Connects the user interface with the business logic layer (`business.js`).
 * - Renders pages to view albums, photos, and edit photo details.
 * - Implements the PRG (Post-Redirect-Get) pattern for form submission.
 * 
 * Structure:
 * 1. Sets up Express and Handlebars with helper functions.
 * 2. Defines static file serving for images and public assets.
 * 3. Implements routes:
 *    - `/` — Landing page showing all albums.
 *    - `/album/:id` — Displays photos in a selected album.
 *    - `/photo/:id` — Shows photo details with title, description, and image.
 *    - `/photo/:id/edit` — Displays edit form for updating title/description.
 *    - POST `/photo/:id/edit` — Handles form submission and updates MongoDB.
 * 
 * Notes:
 * - Uses `photoWord` helper to display “photo” vs “photos”.
 * - Uses `layout: undefined` to disable default Handlebars layouts.
 * - Follows clean separation between Presentation, Business, and Persistence layers.
 */

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const business = require('./business');

const app = express();
app.use(express.static("public")); // Serve assets from /public folder
const PORT = process.env.PORT || 3000;

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: false,
  helpers: {
    // Helper to return "photo" or "photos" based on count
    photoWord: function(count) {
      return count === 1 ? 'photo' : 'photos';
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static images from /photos directory
app.use('/photos', express.static(path.join(__dirname, 'photos')));

// Parse form data
app.use(express.urlencoded({ extended: false }));

// Landing page - list albums
app.get('/', async (req, res) => {
  try {
    const albums = await business.loadAlbums();
    res.render('landing', { albums, layout: undefined });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Album details - list photos, show count
app.get('/album/:id', async (req, res) => {
  try {
    const albumId = Number(req.params.id);
    const albums = await business.loadAlbums();
    const album = albums.find(a => a.id === albumId);
    if (!album) return res.status(404).send('Album not found');

    const photos = await business.getPhotosForAlbum(albumId);
    res.render('album', { album, photos, photoCount: photos.length, layout: undefined });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Photo details
app.get('/photo/:id', async (req, res) => {
  try {
    const photoId = Number(req.params.id);
    const photo = await business.getPhoto(photoId);
    if (!photo) return res.status(404).send('Photo not found');
    res.render('photo', { photo, layout: undefined });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Edit form
app.get('/photo/:id/edit', async (req, res) => {
  try {
    const photoId = Number(req.params.id);
    const photo = await business.getPhoto(photoId);
    if (!photo) return res.status(404).send('Photo not found');
    res.render('editPhoto', { photo, layout: undefined });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Handle edit POST (PRG pattern)
app.post('/photo/:id/edit', async (req, res) => {
  try {
    const photoId = Number(req.params.id);
    const title = req.body.title ? req.body.title.trim() : '';
    const description = req.body.description ? req.body.description.trim() : '';

    // Server-side validation: require non-empty title and description
    if (!title || !description) {
      // Show a simple message and let user hit Back (no auto redirect)
      return res.status(400).send('Title and description are required. <a href="javascript:history.back()">Back</a>');
    }

    const updated = await business.updatePhoto(photoId, title, description);
    if (!updated) {
      return res.status(500).send('Could not update photo. <a href="javascript:history.back()">Back</a>');
    }

    // PRG: redirect to photo details
    res.redirect(`/photo/${photoId}`);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
