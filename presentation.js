// HUDA MANSOORI
// 60304645
// ASSIGNMENT03

/**
 * Photo Management CLI
 * ---------------------
 * This is the presentation layer of the application.
 * It provides a command-line interface (CLI) for users
 * to interact with the photo management system.
 *
 * Features:
 * 1. List Albums
 * 2. List Photos in Album
 * 3. Update Photo Details
 * 4. Exit
 *
 * The script communicates with the business layer (business.js)
 * which handles all logic and data fetching from MongoDB
 * through the persistence layer.
 */

const prompt = require('prompt-sync')();
const business = require('./business');

/**
 * Main program loop.
 * Displays menu options and handles user input.
 */
async function main() {
    while (true) {
        console.log("\nOptions:");
        console.log("1. List Albums");
        console.log("2. List Photos in Album");
        console.log("3. Update Photo Details");
        console.log("4. Exit");

        const selection = Number(prompt("Your selection: "));

        if (selection === 1) {
            const albums = await business.loadAlbums();
            console.log("Albums:");
            albums.forEach(a => console.log(`${a.id}: ${a.name}`));
        }
        else if (selection === 2) {
            const albumId = Number(prompt("Album ID? ")); 
            const photos = await business.loadPhotos();
            const filtered = photos.filter(p => p.albums.includes(albumId));
            if (filtered.length === 0)
                console.log("No photos in this album");
            else
                filtered.forEach(p => console.log(`${p.id}: ${p.title}`));
        }
        else if (selection === 3) {
            const photoId = Number(prompt("Photo ID? ")); 
            const newTitle = prompt("New Title: ");
            const newDesc = prompt("New Description: ");
            const updated = await business.updatePhotoDetails(photoId, newTitle, newDesc);
            console.log(updated ? "Photo updated." : "Photo not found.");
        }
        else if (selection === 4) {
            console.log("Exiting Photo Management App..."); 
            break;
        }
        else {
            console.log("Invalid selection. Please choose 1–4.");
        }
    }
}
main();
