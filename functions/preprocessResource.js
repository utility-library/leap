const fs = require("fs")
const os = require('os');
const winlink = require("winlink")
const glob = require("glob");

const util = require("util")
const setImmediatePromise = util.promisify(setImmediate);

const path = require("path");

const fsPromise = fs.promises

const {GetAllScripts, GetIgnoredFiles, ResolveFile} = require("./manifest")
const {preprocessFile, getResourceFileRelativePath} = require("./utils");

class PreProcessor {
    originalFiles = {}
    files = {}
    resourceName = ""

    constructor(resourceName) {
        this.resourceName = resourceName
        this.verbose = GetConvar("leap_verbose", "false") == "true"
    }

    async run(type) {
        let resourcePath = GetResourcePath(this.resourceName)
        let files = GetAllScripts(this.resourceName, type)
        let ignoredFiles = GetIgnoredFiles(this.resourceName)
        
        if (files.length == 0) {
            throw new Error(`No files provided by the resource (probably a typo), check the manifest of ${this.resourceName}`)
        }

        // Resolve ignored files
        ignoredFiles = ignoredFiles.map(file => ResolveFile(resourcePath, file))
    
        let paths = []
        let promises = []
        let start = undefined

        if (this.verbose) start = Date.now()

        // Preprocess files content
        for (let file of files) {
            let resolvedFiles = ResolveFile(resourcePath, file)
            if (typeof resolvedFiles != "string") {
                for (let resolvedFile of resolvedFiles) {
                    if (ignoredFiles.includes(resolvedFile)) {
                        continue
                    }

                    let [file, promise] = preprocessFile(resolvedFile)

                    if (file && promise) {
                        this.originalFiles[resolvedFile] = file
                        paths.push(resolvedFile)
                        promises.push(promise)
                    }
                }
            } else {
                if (ignoredFiles.includes(resolvedFiles)) {
                    continue
                }

                let [file, promise] = preprocessFile(resolvedFiles)
    
                if (file && promise) {
                    this.originalFiles[resolvedFiles] = file
                    paths.push(resolvedFiles)
                    promises.push(promise)
                }                    
            }
        }

        let preprocessed = await Promise.allSettled(promises)

        if (this.verbose) console.log(`^2preprocessing: ${Date.now() - start}ms^0`)

        // Save preprocessed files
        paths.forEach((filePath, index) => {
            if (preprocessed[index].status == "rejected") {
                let relativePath = "";

                if (filePath.includes(this.resourceName)) {
                    relativePath = getResourceFileRelativePath(filePath, this.resourceName)
                } else {
                    relativePath = getResourceFileRelativePath(filePath, "resources")
                }

                throw new Error(relativePath + ": " + preprocessed[index].reason.message)
            } else {
                const content = preprocessed[index].value
        
                this.files[filePath] = content
            }
        })
    }

    async write(subFolder) {
        let promises = []
        let start = undefined

        // Wait next tick (prevent file emptying when starting server, files its being used by the server)
        await setImmediatePromise()

        if (this.verbose) start = Date.now()

        for (let [filePath, content] of Object.entries(this.files)) {
            if (subFolder) {
                filePath = filePath.replace(this.resourceName, this.resourceName + "/" + subFolder)
                let outputDir = filePath.replace(/\w+.lua/, "")

                fs.mkdirSync(outputDir, {recursive: true})

                let promise = fsPromise.writeFile(filePath, content)
                promises.push(promise)
            } else {
                let promise = fsPromise.writeFile(filePath, content)
                promises.push(promise)
            }
        }

        await Promise.all(promises)

        if (this.verbose) console.log(`^2writing: ${Date.now() - start}ms^0`)
    }
    
    async writeOriginal() {
        await setImmediatePromise()

        let promises = []

        for (let [filePath, content] of Object.entries(this.originalFiles)) {
            let promise = fsPromise.writeFile(filePath, content)
            promises.push(promise)
        }

        await Promise.all(promises)
    }

    async createTempBackup() {
        const tmpDir = os.tmpdir()
        const destDir = path.join(tmpDir, "leap", this.resourceName)
        const resourcePath = GetResourcePath(this.resourceName)

        let files = glob.sync("*.lua", {cwd: resourcePath, absolute: true, windowsPathsNoEscape: true})

        for (let filePath of files) {
            let relativePath = getResourceFileRelativePath(filePath, this.resourceName)
            let outputFile = path.join(destDir, relativePath)
            let outputDir = outputFile.replace(/\w+.lua/, "")

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true})
            }
            
            fs.copyFileSync(filePath, outputFile)
        }

        winlink.writeDirectory(path.join(resourcePath, "backup.lnk"), destDir)
    }
}

module.exports = {
    PreProcessor
}