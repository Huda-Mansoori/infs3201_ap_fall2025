const DateFormat = require('dayjs');
const persistence = require('./persistence');

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
