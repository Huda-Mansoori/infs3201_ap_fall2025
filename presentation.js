const prompt = require('prompt-sync')();
const business = require('./business');

async function main() {
    
    let user = null;
    while (!user) {
        let username = prompt("Username: ");
        let password = prompt("Password: ");
        user = await business.login(username, password);
        if (!user) console.log("Invalid username or password. Try again.");
    }
    console.log(`Welcome, ${user.username}!`);

    while (true) {
        console.log("\nOptions:");
        console.log("1. Find Photo"); 
        console.log("2. Update Photo Details");
        console.log("3. Album Photo List");
        console.log("4. Tag Photo");
        console.log("5. Exit");

        let selection = Number(prompt("Your selection: "));

        if (selection === 1) {
            let id = Number(prompt("Photo ID? "));
            const photo = await business.findPhotoById(id, user.id);
            if (photo === 'unauthorized') console.log("You are not allowed to access this photo.");
            else if (!photo) console.log("Photo not found");
            else {
                console.log(`Filename: ${photo.filename}`);
                console.log(`Title: ${photo.title}`);
                console.log(`Date: ${photo.date}`);
                console.log(`Albums: ${photo.albums.join(", ")}`);
                console.log(`Tags: ${photo.tags.join(", ")}`);
            }
        } 
        else if (selection === 2) {
            let id = Number(prompt("Photo ID? "));
            const photo = await business.findPhotoById(id, user.id);
            if (photo === 'unauthorized') {
                console.log("You are not allowed to update this photo.");
                continue;
            } else if (!photo) {
                console.log("Photo not found");
                continue;
            }

            console.log("Press Enter to keep current value.");
            let newTitle = prompt(`Title [${photo.title}]: `);
            let newDesc = prompt(`Description [${photo.description}]: `);

            const updated = await business.updatePhotoDetails(id, newTitle, newDesc, user.id);
            console.log(updated ? "Photo updated." : "Photo not found");
        }

        else if (selection === 3) {
            let albumName = prompt("Album name? ");
            const list = await business.listAlbumPhotos(albumName);
            if (!list) console.log("Album not found");
            else {
                console.log("filename,resolution,tags");
                list.forEach(p => console.log(`${p.filename} , ${p.resolution}, ${p.tags}:`));
            }
        } 
        else if (selection === 4) {
            let id = Number(prompt("Photo ID? "));
            let tag = prompt("Tag to add? ");
            const result = await business.tagPhoto(id, tag, user.id);
            if (result === 'unauthorized') console.log("You are not allowed to tag this photo.");
            else if (result === 'not found') console.log("Photo not found");
            else if (result === 'empty') console.log("No tag entered");
            else if (result === 'exists') console.log("Tag already exists");
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
