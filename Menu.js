// Huda Mansoori
// 60304645
// Assignment 02

// const fs = require('fs/promises')
const fs = require('fs/promises')
const prompt = require('prompt-sync')(); // calls the factory and gives you the prompt tool whereas without this (); just gives you the factory
const DateFormat = require('dayjs') // for formating dates

// For Photos
/**
 * Loads all photos from the JSON file.
 *
 * @async
 * @function loadPhoto
 * @returns {Promise<Object[]>} A list of photo objects, or an empty array if error occurs.
 */

async function loadPhoto() {
    try {
        const data = await fs.readFile('photos.json', 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        console.error("Error reading photos.json:", err.message)
        return []
    }
}

/**
 * Writes photo data back to the JSON file.
 *
 * @async
 * @function writePhoto
 * @param {Object[]} data - Array of photo objects to write.
 * @returns {Promise<void>} Nothing.
 */
async function writePhoto(data) {
    try {
        await fs.writeFile('photos.json', JSON.stringify(data, null, 2))
    } catch (err) {
        console.error("Error writing photos.json:", err.message)
    }
}


// For Albums
/**
 * Loads all albums from the JSON file.
 *
 * @async
 * @function loadAlbum
 * @returns {Promise<Object[]>} A list of album objects, or an empty array if error occurs.
 */
async function loadAlbum() {
    try {
        const data = await fs.readFile('albums.json', 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        console.error("Error reading albums.json:", err.message)
        return []
    }
}

/**
 * Writes album data back to the JSON file (not currently used).
 *
 * @async
 * @function writeAlbum
 * @param {Object[]} data - Array of album objects to write.
 * @returns {Promise<void>} Nothing.
 */
// no use but i still made it
async function writeAlbum(data) {
    try {
        await fs.writeFile('albums.json', JSON.stringify(data, null, 2))
    } catch (err) {
        console.error("Error writing albums.json:", err.message)
    }
}


// functions
/**
 * Finds a photo by its ID and displays details about it.
 * The details include filename, title, date, albums, and tags.
 *
 * @async
 * @function findPhotoById
 * @returns {Promise<void>} Prints details to the console, does not return anything.
 */


async function findPhotoById() {
    const photos = await loadPhoto()
    const albums = await loadAlbum()

    let id = Number(prompt("Photo ID? "))
    let photo = null
    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id === id) {
            photo = photos[i]
            break
        }
    }

    if (photo === null) {
        console.log("Photo not found")
        return
    }
    // for formatting date
    let formattedDate = DateFormat(photo.date).format("DD MMM YYYY") 

    // list of albums
    let albumNames = []
    for (let i = 0; i < photo.albums.length; i++) {
        let albumId = photo.albums[i]
        for (let j = 0; j < albums.length; j++) {
            if (albums[j].id === albumId) {
                found = albums[j].name
                break
            }
        }
        albumNames[albumNames.length] = found
    }

    console.log(`Filename: ${photo.filename}`)
    console.log(`Title: ${photo.title}`)
    console.log(`Date: ${formattedDate}`)
    console.log(`Albums: ${albumNames.join(", ")}`)
    console.log(`Tags: ${photo.tags.join(", ")}`)

}



/**
 * Updates the title and description of a photo by ID.
 * If no new value is entered, keeps the current value.
 *
 * @async
 * @function updatePhotoDetails
 * @returns {Promise<void>} Saves updates to file, prints status to console.
 */
async function updatePhotoDetails() {
    const photos = await loadPhoto()

    let id = Number(prompt("Photo ID? "))
    let photo = null
    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id === id) {
            photo = photos[i]
            break
        }
    }

    if (photo === null) {
        console.log("Photo not found") 
        return 
    }

    console.log("Press Enter to keep current value.")
    let newTitle = prompt(`Title [${photo.title}]: `)
    if (newTitle !== "") {
        photo.title = newTitle
    }

    let newDesc = prompt(`Description [${photo.description}]: `)
    if (newDesc !== "") {
        photo.description = newDesc
    }

    await writePhoto(photos)
    console.log("Photo updated.")
}


/**
 * Lists all photos belonging to a specific album.
 * Prints filename, resolution, and tags in CSV format.
 *
 * @async
 * @function listAlbumPhotos
 * @returns {Promise<void>} Prints list to console.
 */
async function listAlbumPhotos() {
    const photos = await loadPhoto()
    const albums = await loadAlbum()

    let albumName = prompt("Album name? ")
    let album = null
    for (let i = 0; i < albums.length; i++) {
        if (albums[i].name.toLowerCase() === albumName.toLowerCase()) {
            album = albums[i]
            break
        }
    }

    if (album === null) {
        console.log("Album not found")
        return
    }

    console.log("filename,resolution,tags")
    for (let i = 0; i < photos.length; i++) {
        let p = photos[i]
        let inAlbum = false
        for (let j = 0; j < p.albums.length; j++) {
            if (p.albums[j] === album.id) {
                inAlbum = true
                break
            }
        }
        if (inAlbum) {
            console.log(`${p.filename} , ${p.resolution}, ${p.tags.join(':')}:`)
        }
    }
}


/**
 * Adds a new tag to a photo if it does not already exist.
 *
 * @async
 * @function tagPhoto
 * @returns {Promise<void>} Saves updated tags to file, prints status to console.
 */
async function tagPhoto() {
    const photos = await loadPhoto()

    let id = Number(prompt("Photo ID? "))
    let photo = null
    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id === id) {
            photo = photos[i]
            break
        }
    }

    if (photo === null) {
        console.log("Photo not found")
        return
    }

    let tag = prompt("Tag to add? ")
    if (tag === "") {
        console.log("No tag entered")
        return
    }

    for (let i = 0; i < photo.tags.length; i++) {
        if (photo.tags[i].toLowerCase() === tag.toLowerCase()) {
            console.log("Tag already exists")
            return
        }
    }

    photo.tags[photo.tags.length] = tag
    await writePhoto(photos)
    console.log("Tag added.")
}


/**
 * Main program loop that displays menu options to the user,
 * and calls the corresponding functions.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Runs until user chooses to exit.
 */
// main
async function main() {
    while (true) {
        console.log("\nOptions:")
        console.log("1. Find Photo")
        console.log("2. Update Photo Details")
        console.log("3. Album Photo List")
        console.log("4. Tag Photo")
        console.log("5. Exit")

        let selection = Number(prompt("Your selection: "))

        if (selection === 1) {
            await findPhotoById()
        } else if (selection === 2) {
            await updatePhotoDetails()
        } else if (selection === 3) {
            await listAlbumPhotos()
        } else if (selection === 4) {
            await tagPhoto()
        } else if (selection === 5) {
            console.log("Goodbye!")
            break
        } else {
            console.log("******ERROR!!! Pick a number between 1 and 5")
        }
    }
}

main();