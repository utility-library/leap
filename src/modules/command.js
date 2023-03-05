//#region Library
import fs from 'fs'
import { performance } from 'perf_hooks'
import { execSync } from 'child_process'
//#endregion

//#region Modules
import { PostProcess, ResolveFile } from './modules/postProcessing'
import { GetAllResourceMetadata } from "./modules/manifest.js"
import "./modules/string"
//#endregion

import { Config } from "../config"

//#region Functions
function EsbuildBundle() {
    let resourceName = GetCurrentResourceName()
    let path = GetResourcePath(resourceName)

    execSync("npm run build", {cwd: path})
}

function GetAllScripts(resourceName) {
    let files = []

    files = GetAllResourceMetadata(resourceName, "client_script")
    files.push(...GetAllResourceMetadata(resourceName, "server_script"))
    files.push(...GetAllResourceMetadata(resourceName, "files"))

    return files
}
//#endregion

CreateCommand = function(name) {
    RegisterCommand(name, async (source, args) => {
        let [type, resourceName] = args
    
        if (source != 0) return // only server side can use the command
    
        if (type == "rebundle" && !resourceName) { // esbuild rebuild directly from fxserver
            EsbuildBundle()
            console.log("^2Rebundled^0")
    
            return
        }
    
        if (!type || !resourceName) {
            console.log("parser restart <resource>")
            console.log("parser build <resource>")
            if (Config.Dev) console.log("parser rebundle")
            return
        }
    
        let resourcePath = GetResourcePath(resourceName)
        let start = performance.now()
        let files = GetAllScripts()
        let beforePostProcessing = {}
    
        switch(type) {
            case "build":
                for (let file of files) {
                    let fileDirectory = ResolveFile(resourcePath, file)
                    
                    if (typeof fileDirectory != "string") {
                        for (let fileDir of fileDirectory) {
                            PostProcess(resourceName, fileDir, type)
                        }
                    } else {
                        PostProcess(resourceName, fileDirectory, type)
                    }
                }
    
                break;
            case "restart":
                let postProcessedFiles = {}
    
                for (let file of files) {
                    //console.log(file)
                    let fileDirectory = ResolveFile(resourcePath, file)
                    //console.log(fileDirectory)
                    
                    if (typeof fileDirectory != "string") {
                        for (let fileDir of fileDirectory) {
                            let file = fs.readFileSync(fileDir, "utf-8")
                            let postProcessed = PostProcess(resourceName, file, type, false)
    
                            beforePostProcessing[fileDir] = file
                            postProcessedFiles[fileDir] = postProcessed
                        }
                    } else {
                        let file = fs.readFileSync(fileDirectory, "utf-8")
                        let postProcessed = PostProcess(resourceName, file, type, false)
    
                        beforePostProcessing[fileDirectory] = file
                        postProcessedFiles[fileDirectory] = postProcessed
                    }
                }
    
                let doneWrite = []
    
                let writing = new Promise((resolve) => {
                    for (let fileDir in postProcessedFiles) {
                        let file = postProcessedFiles[fileDir]
    
                        doneWrite.push(fileDir)
                        fs.writeFile(fileDir, file, (err) => {
                            if (err) 
                                console.log(err)
                            else {
                                let index = doneWrite.indexOf(fileDir)
                                if (index > -1) {
                                    doneWrite.splice(index, 1)
                                }
    
                                if (doneWrite.length == 0) {    
                                    resolve(true)
                                }
                            }
                        })
                    }
                })
    
                await writing;
                break;
        }
    
        if (Config.Dev) console.log("Post processed in: ^2"+(performance.now() - start)+"^0ms")
    
        if (type == "restart") {
            // Explanation:
            // FiveM will read the files, cache them and start the resource with those cached files
            // as soon as it has started the resource we rewrite the old file so it looks like nothing happened
            // (this will be executed in very few ms (5/10) so it will look like it was never overwritten)
    
            // Restart the resource with the builded files
            StopResource(resourceName)
            StartResource(resourceName)
    
            for (let path in beforePostProcessing) {
                fs.writeFileSync(path, beforePostProcessing[path]) // Rewrite old files (before post process)
            }
        }
    
    }, true)
}

export {CreateCommand}