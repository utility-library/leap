const leapparser = require("leapparser")

function preprocessFile(filePath) {
    let itsEscrowed = /^FXAP/
    let file = fs.readFileSync(filePath, "utf-8")

    // Exclude escrowed files and 0 length files
    if (file.length > 0 && itsEscrowed.exec(file) == null) {
        try {
            let promise = leapparser.preprocess(file)

            return [file, promise]
        } catch (e) {
            throw e
        }
    } else {
        return [null, null]
    }
}

function getResourceFileRelativePath(filePath, resourceName) {
    let generalDir = filePath.slice(filePath.lastIndexOf(resourceName))

    // Remove the resource name
    generalDir = generalDir.split("\\")
    generalDir.shift()
    generalDir = generalDir.join("\\")

    return generalDir
}

module.exports = {
    preprocessFile,
    getResourceFileRelativePath
}