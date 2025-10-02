const prompt = require('prompt-sync')()
const business = require('./business')

async function main() {
    while (true) {
        console.log("\nOptions:")
        console.log("1. Find Photo")
        console.log("2. Update Photo Details")
        console.log("3. Album Photo List")
        console.log("4. Tag Photo")
        console.log("5. Exit")

        let choice = Number(prompt("Your selection: "))

        if (choice === 1) {
            let id = Number(prompt("Photo ID? "))
            const photo = await business.findPhotoById(id)
            if (!photo) {
                console.log("Photo not found.")
            } else {
                console.log(`Filename: ${photo.filename}`)
                console.log(`Title: ${photo.title}`)
                console.log(`Date: ${photo.date}`)
                console.log(`Albums: ${photo.albums.join(", ")}`)
                console.log(`Tags: ${photo.tags.join(", ")}`)
            }

        } else if (choice === 2) {
            let id = Number(prompt("Photo ID? "))
            let newTitle = prompt("New Title (Enter to skip): ")
            let newDesc = prompt("New Description (Enter to skip): ")
            const success = await business.updatePhotoDetails(id, newTitle, newDesc)
            console.log(success ? "Photo updated." : "Photo not found.")

        } else if (choice === 3) {
            let albumName = prompt("Album name? ")
            const photos = await business.listAlbumPhotos(albumName)
            if (!photos) {
                console.log("Album not found.")
            } else {
                console.log("filename,resolution,tags")
                photos.forEach(p =>
                    console.log(`${p.filename}, ${p.resolution}, ${p.tags.join(":")}`)
                )
            }

        } else if (choice === 4) {
            let id = Number(prompt("Photo ID? "))
            let tag = prompt("Tag to add? ")
            const success = await business.tagPhoto(id, tag)
            console.log(success ? "Tag added." : "Photo not found or tag exists.")

        } else if (choice === 5) {
            console.log("Goodbye!")
            break
        } else {
            console.log("Invalid choice. Please pick between 1–5.")
        }
    }
}

main()
