//#region Library
import fs from 'fs'
import VerEx from 'verbal-expressions'
import { performance } from 'perf_hooks'
import { execSync } from 'child_process'
//#endregion

//#region Modules
import { PostProcess, ResolveFile } from '../modules/postProcessing'
import { GetAllResourceMetadata } from "../modules/manifest.js"
import "../modules/string"
//#endregion

import { Config } from "../../config"
import { UpdateLastBuildTimeForResource, vscodeInstalled } from '../index'


//#region Functions
function EsbuildBuild() {
    let resourceName = GetCurrentResourceName()
    let path = GetResourcePath(resourceName)

    execSync("npm run build", {cwd: path})
}

function GetAllScripts(resourceName, type) {
    let files = []

    files = GetAllResourceMetadata(resourceName, "client_script", type)
    files.push(...GetAllResourceMetadata(resourceName, "server_script", type))
    files.push(...GetAllResourceMetadata(resourceName, "shared_script", type))
    files.push(...GetAllResourceMetadata(resourceName, "files", type))

    return files
}
//#endregion

async function Command(source, args) {
    let [type, resourceName, buildTask] = args

    if (source != 0) return // only server side can use the command

    if (type == "rebuild") { // esbuild rebuild directly from fxserver
        if (resourceName) { console.log("^1The rebuild command does not need a resource, did you mean to write \"leap build\"?^0") }

        EsbuildBuild()
        console.log("^2Rebuilt^0")

        return
    }

    if (!type || !resourceName) {
        console.log(`leap restart <resource>`)
        console.log(`leap build <resource>`)
        if (Config.Dev) console.log(`leap rebuild`)
        return
    }

    let resourcePath = GetResourcePath(resourceName)
    let start = performance.now()
    let files = GetAllScripts(resourceName, type)
    let beforePreProcessing = {}

    if (files.length == 0) {
        if (buildTask) {
            return [false, `^1No files provided by the resource (probably a typo), check the manifest of ${resourceName}^0`]
        } else {
            console.log(`^1No files provided by the resource (probably a typo), check the manifest of ${resourceName}^0`)
            return
        }
    }

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
            UpdateLastBuildTimeForResource(resourceName)
        
            let startPreprocess = performance.now()
            let preProcessedFiles = {}

            for (let file of files) {
                let fileDirectory = ResolveFile(resourcePath, file)

                let itsEscrowed = VerEx()
                    .startOfLine()
                    .find("FXAP")
                    .removeModifier("m")
                    .addModifier("s")

                if (typeof fileDirectory != "string") {
                    for (let fileDir of fileDirectory) {
                        let file = await fs.promises.readFile(fileDir, "utf-8")

                        if (file.length > 0) {
                            // ignore escrowed files
                            if (!itsEscrowed.test(file)) {
                                let postProcessed = PostProcess(resourceName, file, type)

                                if (file.length != postProcessed.length) {
                                    beforePreProcessing[fileDir] = file
                                    preProcessedFiles[fileDir] = postProcessed
                                }
                            }
                        }
                    }
                } else {
                    let file = fs.readFileSync(fileDirectory, "utf-8")

                    if (file.length > 0) {
                        // ignore escrowed files
                        if (!itsEscrowed.test(file)) {
                            let postProcessed = PostProcess(resourceName, file, type)

                            if (file.length != postProcessed.length) {
                                beforePreProcessing[fileDirectory] = file
                                preProcessedFiles[fileDirectory] = postProcessed
                            }
                        }
                    }
                }
            }

            let endPreprocess = performance.now()
            
            let doneWrite = []

            //console.log("Started writing")
            //console.log(preProcessedFiles)

            let keys = Object.keys(preProcessedFiles)
            let startWriting = performance.now()
            
            if (keys.length == 0 && files.length == 0) {
                return [false, `^1No files provided by the resource (probably a typo), check the manifest of ${resourceName}^0`]
            } else {}
            
            if (keys.length == 0) {
                console.log("^3No file needs preprocessing, the resource will be started without preprocessing (you probably put leap in the dependencies without actually using it in any files)^0")

                return [true]
            } else {
                if (keys.length == 1) {
                    let fileDir = keys[0]
                    let file = preProcessedFiles[fileDir]
                    fs.writeFileSync(fileDir, file)
                } else {
                    let writing = new Promise((resolve) => {
                        for (let fileDir in preProcessedFiles) {
                            let file = preProcessedFiles[fileDir]
                            
                            doneWrite.push(fileDir)
                            fs.writeFile(fileDir, file, (err) => {
                                if (err) 
                                    return [false, err]
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
                }

                let endWriting = performance.now()
            
                if (Config.Dev) console.log("Pre process runtime: ^3"+(endPreprocess - startPreprocess)+"^0ms")
                if (Config.Dev) console.log("Writing runtime: ^3"+(endWriting - startWriting)+"^0ms")
            }
            break;
    }


    if (Config.Dev) console.log("Pre processed in: ^2"+(performance.now() - start)+"^0ms" + (vscodeInstalled && " (^3you need to remove some time since there is the vscode watcher exclusion^0)"))

    if (type == "restart") {
        // Explanation:
        // FiveM will read the files, cache them and start the resource with those cached files
        // as soon as it has started the resource we rewrite the old file so it looks like nothing happened
        // (this will be executed in very few ms (5/10) so it will look like it was never overwritten)

        // Restart the resource with the builded files
        
        if (buildTask) {
            setTimeout(() => {
                for (let path in beforePreProcessing) {
                    fs.writeFileSync(path, beforePreProcessing[path]) // Rewrite old files (before post process)
                }
            }, 10);

            return [true]
        } else {
            StopResource(resourceName)
            StartResource(resourceName)

            for (let path in beforePreProcessing) {
                fs.writeFileSync(path, beforePreProcessing[path]) // Rewrite old files (before post process)
            }
        }
    }
}

function CreateCommand(name) {
    RegisterCommand(name, Command, true)
}

export {CreateCommand, Command}
