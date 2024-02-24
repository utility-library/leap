const glob = require("glob")
const path = require('path');

function GetAllScripts(resourceName, type) {
    let files = []

    files = GetAllResourceMetadata(resourceName, "client_script", type)
    files.push(...GetAllResourceMetadata(resourceName, "server_script", type))
    files.push(...GetAllResourceMetadata(resourceName, "shared_script", type))
    files.push(...GetAllResourceMetadata(resourceName, "files", type))

    return files
}

function GetIgnoredFiles(resourceName) {
    let files = GetAllResourceMetadata(resourceName, "leap_ignore")

    return files
}

function GetAllResourceMetadata(resourceName, key, type) {
    let metadataNum = GetNumResourceMetadata(resourceName, key)
    let result = []

    for (let i=0; i < metadataNum; i++) {     
        let metadata = GetResourceMetadata(resourceName, key, i)
 
        if (!metadata.includes("--") && (metadata.includes(".lua") || metadata.includes(".*"))) {
            if (type == "build") {
                if (metadata.includes("@")) {
                    continue
                }
            }

            result.push(metadata)
        }
    }

    return result
}

function ResolveFile(resourcePath, file) {
    if (file.includes("@")) {
        let regex = /@(.*?)\/(.*)/g
        let match = regex.exec(file)
        let resourceName = match[1]
        file = match[2]
        
        resourcePath = GetResourcePath(resourceName)
    }

    /* Check if the file being resolved uses globbing. */
    if (file.includes("*")) {
        if (file.includes("**")) {
            /* Replace the FiveM recursive globbing pattern with the Node recursive globbing pattern. */
            file = file.replace("**", "**/*")
        }
        
        let files = glob.sync(file, {cwd: resourcePath, absolute: true, windowsPathsNoEscape: true})

        files = files.filter(file => {
            if (path.extname(file) == ".lua") {
                return file
            }
        })

        return files
    } else {
        resourcePath = resourcePath.replace(/(\/\/|\/)/g, "\\")
        file = file.replaceAll("/", "\\")

        return resourcePath + "\\" + file
    }
}

module.exports = {GetAllScripts, GetIgnoredFiles, ResolveFile}