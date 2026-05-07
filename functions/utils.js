const fs = require("fs")
const path = require("path")
const {GetAllScripts, GetIgnoredFiles, ResolveFile} = require("./manifest")
const {Worker} = require("worker_threads")

const worker = new Worker(`
    const { parentPort } = require("worker_threads");
    const fs = require("fs");
    const path = require("path");

    parentPort.on("message", (msg) => {
        try {
            if (msg.type === "write") {
                fs.mkdirSync(path.dirname(msg.path), {recursive: true})
                fs.writeFileSync(msg.path, msg.content);

                parentPort.postMessage({
                    ok: true,
                    action: "write",
                    path: msg.path
                });
                return;
            }

            if (msg.type === "remove") {
                fs.rmSync(msg.path, msg.options);

                parentPort.postMessage({
                    ok: true,
                    action: "remove",
                    path: msg.path
                });
                return;
            }

            parentPort.postMessage({
                ok: false,
                error: "Unknown action type"
            });
        } catch (e) {
            parentPort.postMessage({
                ok: false,
                error: e.message
            });

        }
    });
`, { eval: true });

worker.on("error", (err) => {
  console.log("worker crashed:", err);
});

worker.on("exit", (code) => {
  console.log("worker exit:", code);
});

function writeFile(filePath, content) {
    return new Promise((resolve, reject) => {
        const onMessage = (msg) => {
            worker.off("message", onMessage);

            if (msg.ok) {
                resolve(msg);
            } else {
                reject(msg.error);
            }
        };

        worker.on("message", onMessage);

        worker.postMessage({
            type: "write",
            path: filePath,
            content: content
        });
    });
}

function rmSync(filePath, options) {
    return new Promise((resolve, reject) => {
        const onMessage = (msg) => {
            worker.off("message", onMessage);

            if (msg.ok) {
                resolve(msg);
            } else {
                reject(msg.error);
            }
        };

        worker.on("message", onMessage);

        worker.postMessage({
            type: "remove",
            path: filePath,
            options: options
        });
    });
}

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

    const nDependencies = GetNumResourceMetadata(res, 'dependencie')
    if (nDependencies > 0) {
        for (let i = 0; i < nDependencies; i++) {
            const dependencyName = GetResourceMetadata(res, 'dependencie')

            if (dependencyName == GetCurrentResourceName()) {
                return true;
            }
        }
    }

    return false;
}

function loadCache(resourceName) {
    const path = GetResourcePath(GetCurrentResourceName())

    let file = "[]"

    try {
        file = fs.readFileSync(path + "/cache/" + resourceName + ".json", "utf-8")
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

function cleanDeletedFilesFromBuild(resourceName) {
    const cache = loadCache(resourceName)
    let somethingDeleted = false

    for (let file of cache) {
        const _path = relativeToAbs(file.path, resourceName)
        if (!fs.existsSync(_path)) {
            const buildpath = relativeToAbs("build/"+file.path, resourceName)
            rmSync(buildpath, {force: true})
            somethingDeleted = true
        }
    }

    return somethingDeleted
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
    writeFile,
    rmSync,
    canFileBePreprocessed,
    absToRelative,
    relativeToAbs,
    isLeapDependency,
    loadCache,
    cleanDeletedFilesFromBuild,
    hasCachedFileBeenModified,
    hasAnyFileBeenModified,
    getResourceProcessableFiles
}