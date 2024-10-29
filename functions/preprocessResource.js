const fs = require("fs")
const path = require("path");

const {GetAllScripts, GetIgnoredFiles, ResolveFile} = require("./manifest")
const {canFileBePreprocessed} = require("./utils")
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

    getFiles() {
        let resourcePath = GetResourcePath(this.resourceName)
        let files = GetAllScripts(this.resourceName)
        let ignoredFiles = GetIgnoredFiles(this.resourceName)
        
        ignoredFiles = ignoredFiles.map(file => ResolveFile(resourcePath, file))
        files = files.map(file => ResolveFile(resourcePath, file))
        files = files.flat()

        // Remove ignored files
        files = files.filter(file => !ignoredFiles.includes(file))

        return files
    }

    async run() {
        let files = this.getFiles()
        
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

                        console.log("Preprocessed " + filePath)
                        resolve()
                    } catch (e) {
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
            !line.includes(ignoredFiles) // Skip building ignored files
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

            for (let line of lines) {
                if (this.lineNeedToBeBuildRelative(line, ignored)) {
                    line = line.replace(/(["'])/, "$1build/")
                    somethingChanged = true
                }

                newLines.push(line)
            }

            if (somethingChanged) {
                ExecuteCommand("refresh")

                // Wait 1s for the resource to be refreshed (should be enough)
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000))
            }

            fs.writeFileSync(fxmanifest, newLines.join("\n"))
        }
    }
}

module.exports = {
    PreProcessor
}