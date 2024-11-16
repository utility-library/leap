const fs = require("fs")
const {GetAllScripts, GetIgnoredFiles, ResolveFile} = require("./manifest")

function getResourceProcessableFiles(resourceName) {
    let resourcePath = GetResourcePath(resourceName)
    let files = GetAllScripts(resourceName)
    let ignoredFiles = GetIgnoredFiles(resourceName)
    
    ignoredFiles = ignoredFiles.map(file => ResolveFile(resourcePath, file))
    ignoredFiles = ignoredFiles.flat()

    files = files.map(file => ResolveFile(resourcePath, file))
    files = files.flat()

    // Remove ignored files
    files = files.filter(file => !ignoredFiles.includes(file))

    return files
}

function canFileBePreprocessed(filePath) {
    try {
        let itsEscrowed = /^FXAP/
        let file = fs.readFileSync(filePath, "utf-8")
    
        return fs.existsSync(filePath) && 
               fs.statSync(filePath).isFile() && 
               itsEscrowed.exec(file) == null && 
               file.length > 0
    } catch (e) {
        return false
    }
}

function isLeapDependency(res) {
    const nDependency = GetNumResourceMetadata(res, 'dependency');

    if (nDependency > 0) {
        for (let i = 0; i < nDependency; i++) {
            const dependencyName = GetResourceMetadata(res, 'dependency');

            if (dependencyName == GetCurrentResourceName()) {
                return true;
            }
        }
    }

    return false;
}

function loadCache(resourceName) {
    let file = "[]"

    try {
        file = fs.readFileSync("cache/leap/" + resourceName + ".json", "utf-8")
    } catch (e) {}

    return JSON.parse(file)
}

function hasCachedFileBeenModified(file, resourceName) {
    const filePath = relativeToAbs(file.path, resourceName)

    if (!fs.existsSync(filePath)) {
        return true
    }

    const stats = fs.statSync(filePath)

    if (stats.mtimeMs != file.mtime || stats.size != file.size || stats.ino != file.inode) {
        return true
    }
}

function hasAnyFileBeenModified(resourceName) {
    const files = getResourceProcessableFiles(resourceName)
    const cache = loadCache(resourceName)

    // No cache found
    if (cache.length == 0) {
        return true
    }

    if (cache.length < files.length) {
        return true
    }

    for (let file of cache) {
        if (hasCachedFileBeenModified(file, resourceName)) {
            return true
        }
    }

    return false
}

function absToRelative(filePath, resourceName) {
    let resourcePath = GetResourcePath(resourceName)
    resourcePath = resourcePath.replace(/(\/\/|\/)/g, "\\")

    return filePath.replace(resourcePath, "")
}

function relativeToAbs(filePath, resourceName) {
    let resourcePath = GetResourcePath(resourceName)
    resourcePath = resourcePath.replace(/(\/\/|\/)/g, "\\")

    return path.join(resourcePath, filePath)
}

module.exports = {
    canFileBePreprocessed,
    absToRelative,
    relativeToAbs,
    isLeapDependency,
    loadCache,
    hasCachedFileBeenModified,
    hasAnyFileBeenModified,
    getResourceProcessableFiles
}