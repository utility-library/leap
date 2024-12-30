const fs = require("fs")
const path = require("path");

const {GetAllScripts, GetIgnoredFiles, ResolveFile} = require("./manifest")
const {canFileBePreprocessed, absToRelative, loadCache, hasCachedFileBeenModified, getResourceProcessableFiles} = require("./utils")
const {preprocessCode} = require("./leap");

const replaceLast = (str, pattern, replacement) => {
    const last = str.lastIndexOf(pattern);

    if (last !== -1) {
        return str.slice(0, last) + replacement + str.slice(last + pattern.length);
    } else {
        return str;
    }
  };

class PreProcessor {
    files = {}
    resourceName = ""

    constructor(resourceName) {
        this.resourceName = resourceName
        this.verbose = GetConvar("leap_verbose", "false") == "true"
    }

    getFilesToBuild() {
        const files = getResourceProcessableFiles(this.resourceName)
        const cache = loadCache(this.resourceName)
        const filesToBuild = []

        // Something has been deleted, trigger full rebuild
        if (files.length < cache.length) {
            this.clearBuildFolder()
            return files
        }

        files.map(file => {
            const cachedFile = cache.find(cacheFile => cacheFile.path == absToRelative(file, this.resourceName))

            if (!cachedFile) {
                filesToBuild.push(file)
                return
            }

            if (hasCachedFileBeenModified(cachedFile, this.resourceName)) {
                filesToBuild.push(file)
            }
        })

        return filesToBuild
    }

    clearBuildFolder() {
        fs.rmSync(path.join(this.resourceName, "build/"), {recursive: true, force: true})
    }

    async run(ignoreCache) {
        let files = ignoreCache ? getResourceProcessableFiles(this.resourceName) : this.getFilesToBuild()
        
        if (files.length == 0) {
            throw new Error(`No files provided by the resource (probably a typo), check the manifest of ${this.resourceName}`)
        }

        let promises = []
        let start = Date.now()

        // Preprocess files content
        for (let filePath of files) {
            let promise = null

            if (canFileBePreprocessed(filePath)) {
                promise = new Promise((resolve, reject) => {
                    try {
                        let file = fs.readFileSync(filePath, "utf-8")
                        let preprocessed = preprocessCode(file)
                        
                        let filePathBuild = replaceLast(filePath, this.resourceName, path.join(this.resourceName, "build/"))

                        fs.mkdirSync(path.dirname(filePathBuild), {recursive: true})
                        fs.writeFileSync(filePathBuild, preprocessed)

                        resolve()
                    } catch (e) {
                        if (e.errors) {
                            for (let error of e.errors) {
                                const relpath = absToRelative(filePath, this.resourceName)
                                console.log(`^1Error parsing script @${this.resourceName}${relpath}:${error.line}: ${error.message}`)
                            }
                        } else {
                            console.error(e.message)
                        }
                        reject(e)
                    }
                })
            } else {
                // Copy file as it is
                promise = new Promise((resolve, reject) => {
                    let file = fs.readFileSync(filePath, "utf-8")

                    let filePathBuild = replaceLast(filePath, this.resourceName, path.join(this.resourceName, "build/"))

                    fs.mkdirSync(path.dirname(filePathBuild), {recursive: true})
                    fs.writeFileSync(filePathBuild, file)
                    resolve()
                })
            }

            promises.push(promise)
        }

        let preprocessed = await Promise.allSettled(promises)

        if (this.verbose) console.log(`^2preprocessing: ${Date.now() - start}ms^0`)

        preprocessed.map((file, index) => {
            if (file.status == "rejected") {
                throw new Error("Error detected when preprocessing")
            }
        })
    }

    lineNeedToBeBuildRelative(line, ignoredFiles) {
        return (
            !line.includes("build/") && !line.includes("@") // Not already build relative and not externally loaded
        ) && (
            line.includes("\"") || line.includes("'") // Its a string
        ) && (
            line.includes(".lua") || line.includes(".*") // Its a lua/any file
        ) && (
            ignoredFiles.length == 0 || !ignoredFiles.some(file => line.includes(file)) // Skip building ignored files
        )
    }

    async setPathsAsBuildRelative() {
        let resourcePath = GetResourcePath(this.resourceName)
        let fxmanifest = path.join(resourcePath, "fxmanifest.lua")
        let somethingChanged = false

        if (fs.existsSync(fxmanifest)) {
            let file = fs.readFileSync(fxmanifest, "utf-8")
            let lines = file.split("\n")
            let newLines = []

            const ignored = GetIgnoredFiles(this.resourceName)
            let check = false
            let singleFile = false

            for (let line of lines) {
                if (!check) {
                    // Start multiple files
                    if (line.startsWith("client_scripts") || line.startsWith("server_scripts") || line.startsWith("shared_scripts") || line.startsWith("escrow_ignore")) {
                        check = true

                    // Start single file, dont skip
                    } else if (line.startsWith("client_script") || line.startsWith("server_script") || line.startsWith("shared_script")) {
                        check = true
                        singleFile = true
                    }
                } else {
                    // End of multi file
                    if (line.startsWith("}")) {
                        check = false
                    }
                }

                if (check) {
                    //console.log(line, ignored, ignored.some(file => line.includes(file)))
                    if (this.lineNeedToBeBuildRelative(line, ignored)) {
                        line = line.replace(/(["'])/, "$1build/")
                        somethingChanged = true
                    }

                    // Single file, reset check
                    if (singleFile) {
                        singleFile = false
                        check = false
                    }
                }

                newLines.push(line)
            }

            fs.writeFileSync(fxmanifest, newLines.join("\n"))

            if (somethingChanged) {
                ExecuteCommand("refresh")
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000))
            }
        }
    }

    async writeCache() {
        let cache = []

        for (let filePath of getResourceProcessableFiles(this.resourceName)) {
            const stats = fs.statSync(filePath)

            cache.push({
                path: absToRelative(filePath, this.resourceName),
                mtime: stats.mtimeMs,
                size: stats.size,
                inode: stats.ino
            })
        }

        fs.mkdirSync("cache/leap/", {recursive: true})
        fs.writeFileSync("cache/leap/" + this.resourceName + ".json", JSON.stringify(cache))
    }
}

module.exports = {
    PreProcessor
}