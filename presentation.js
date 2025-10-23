// HUDA MANSOORI
// 60304645
// ASSIGNMENT 03

// presentation.js
const prompt = require('prompt-sync')();
const business = require('./business');

async function main() {
    console.log("Welcome to the Photo Management App!");

    while (true) {
        console.log("\nOptions:");
        console.log("1. Find Photo");
        console.log("2. Update Photo Details");
        console.log("3. Album Photo List");
        console.log("4. Tag Photo");
        console.log("5. Exit");

        const selection = Number(prompt("Your selection: "));

        if (selection === 1) {
            const id = Number(prompt("Photo ID? "));
            const photo = await business.findPhotoById(id);
            if (!photo) console.log("Photo not found.");
            else {
                console.log(`Filename: ${photo.filename}`);
                console.log(`Title: ${photo.title}`);
                console.log(`Description: ${photo.description}`);
                console.log(`Date: ${photo.date}`);
                console.log(`Albums: ${photo.albums.join(", ")}`);
                console.log(`Tags: ${photo.tags.join(", ")}`);
            }
        } 
        else if (selection === 2) {
            const id = Number(prompt("Photo ID? "));
            const photo = await business.findPhotoById(id);
            if (!photo) {
                console.log("Photo not found.");
                continue;
            }

            console.log("Press Enter to keep current value.");
            const newTitle = prompt(`Title [${photo.title}]: `);
            const newDesc = prompt(`Description [${photo.description}]: `);

            const updated = await business.updatePhotoDetails(id, newTitle, newDesc);
            console.log(updated ? "Photo updated." : "Photo not found.");
        } 
        else if (selection === 3) {
            const albumName = prompt("Album name? ");
            const list = await business.listAlbumPhotos(albumName);
            if (!list) console.log("Album not found.");
            else {
                console.log("filename,resolution,tags");
                list.forEach(p => console.log(`${p.filename} , ${p.resolution}, ${p.tags}`));
            }
        } 
        else if (selection === 4) {
            const id = Number(prompt("Photo ID? "));
            const tag = prompt("Tag to add? ");
            const result = await business.tagPhoto(id, tag);
            if (result === 'not found') console.log("Photo not found.");
            else if (result === 'empty') console.log("No tag entered.");
            else if (result === 'exists') console.log("Tag already exists.");
            else console.log("Tag added.");
        } 
        else if (selection === 5) {
            console.log("Goodbye!");
            break;
        } 
        else console.log("******ERROR!!! Pick a number between 1 and 5");
    }
}

main();
