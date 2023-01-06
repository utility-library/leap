import fs from 'fs'
import { performance } from 'perf_hooks'

import glob from "glob"
import VerEx from 'verbal-expressions'
import chalk from 'chalk'
import dedent from "dedent"
import {GetAllResourceMetadata} from "./modules/manifest.js"
import {MatchRegex, MatchAllRegex} from "./modules/regex.js"

import {Natives} from './modules/natives.js'

let Regexes = [
    {
        from: VerEx()
            .find("(")
            // Get parameters
            .beginCapture()
                .anythingBut("()")
            .endCapture()

            .then(")")
            .maybe(" ")
            .then("=>")
            .maybe(" ")
            .then("{")
        ,
        to: function(verbalEx, fileData) {
            let regExp = verbalEx.toRegExp()
            let matchIndices = MatchAllRegex(fileData, regExp).map(x => x.index);
            //console.log("Match indices:", regExp)

            for (let i of matchIndices) {
                let linesAfterMatch = fileData.slice(i)
                fileData = ReplaceFunctionEnding(fileData, linesAfterMatch)
            } 
            
            fileData = fileData.replace(regExp, "function($1)")
            //console.log("FileData:", fileData)

            return fileData
        },
    },
    {
        from: VerEx()
            // Get parameters
            .beginCapture()
                .word()
            .endCapture()
            .maybe(" ")
            .then("=>")
            .maybe(" ")
            .then("{")
        ,
        to: function(verbalEx, fileData) {
            let regExp = verbalEx.toRegExp()

            let matchIndices = MatchAllRegex(fileData, regExp).map(x => x.index);

            for (let i of matchIndices) {
                let linesAfterMatch = fileData.slice(i)
                fileData = ReplaceFunctionEnding(fileData, linesAfterMatch)
            } 
            
            fileData = fileData.replace(regExp, "function($1)")

            return fileData
        },
    },
    {
        from: "!=",
        to: "~="
    },
    {
        from: VerEx()
            .find("class")
            .maybe(" ")
            .beginCapture()
                .word()
            .endCapture()
            .maybe(" ")
            .then("{")
        ,
        to: function(verbalEx, fileData) {
            let regExp = verbalEx.toRegExp()
            let matchIndices = MatchAllRegex(fileData, regExp).map(x => x.index);

            for (let i of matchIndices) {
                let linesAfterMatch = fileData.slice(i)
                fileData = ReplaceFunctionEnding(fileData, linesAfterMatch, "}")
            }
            
            return fileData.replace(verbalEx, dedent`
                $1 = function(...)
                    local obj = setmetatable({}, {
                        __index = function(self, key) 
                            return Prototype$1[key] 
                        end
                    })

                    if obj.constructor then
                        obj:constructor(...)
                    end

                    return obj
                end

                Prototype$1 = {
            `)
        }
    },
    {
        from: VerEx()
            .find("class")
            .maybe(" ")
            .beginCapture()
                .word()
            .endCapture()
            .maybe(" ")
            .find("extends")
            .maybe(" ")
            .beginCapture()
                .word()
            .endCapture()
            .maybe(" ")

            .then("{")
        ,
        to: function(verbalEx, fileData) {
            let regExp = verbalEx.toRegExp()
            let matchIndices = MatchAllRegex(fileData, regExp).map(x => x.index);

            for (let i of matchIndices) {
                let linesAfterMatch = fileData.slice(i)
                fileData = ReplaceFunctionEnding(fileData, linesAfterMatch, "}")
            }
            
            return fileData.replace(verbalEx, dedent`
                $1 = function(...)
                    if Prototype$2 then
                        Prototype$1.super = setmetatable({}, {
                            __index = function(self, key)
                                return Prototype$2[key]
                            end,
                            __call = function(self, ...)
                                self.constructor(...)
                            end
                        })
                    else
                        error("ExtendingNotDefined: trying to extend the class $2 that is not defined")
                    end

                    local obj = setmetatable({}, {
                        __index = function(self, key) 
                            return Prototype$1[key] or Prototype$2[key] 
                        end
                    })

                    if obj.constructor then
                        obj:constructor(...)
                    end

                    return obj
                end

                Prototype$1 = {
            `)
        }
    }
]

String.prototype.occurrences = function(string) {
    let regex = new RegExp(string, "g")

    return (this.match(regex) || []).length
}

function ReplaceFunctionEnding(string, linesAfterMatch, to) {
    let lineByLine = linesAfterMatch.split("\n") // Unpack lines

    let curlyBracesCounter = 0
    for (let i in lineByLine) {
        let line = lineByLine[i]
        
        curlyBracesCounter += line.occurrences("{")
        curlyBracesCounter -= line.occurrences("}")

        //console.log(curlyBracesCounter)
        if (curlyBracesCounter == 0) {
            lineByLine[i] = line.replace("}", to || "end")
            break
        }
    }
    
    return string.replace(linesAfterMatch, lineByLine.join("\n")) // Pack lines
}

function ResolveFile(resourcePath, file) {
    if (file.includes("*") > 0) { // If have some glob
        return glob.sync(file, {cwd: resourcePath, absolute: true})
    } else {
        return resourcePath+"/"+file
    }
}

function PostProcess(resourceName, file, type) {
    let fileData = fs.readFileSync(file, "utf-8")

    for (let regex of Regexes) {
        if (typeof regex.from == "string") {
            fileData = fileData.replace(regex.from, regex.to)
        } else {
            regex.from.removeModifier("g") // Prevent lastIndex from giving false negatives
            let match = regex.from.test(fileData)
            regex.from.addModifier("g")

            if (match) {
                if (typeof regex.to == "string") {
                    fileData = fileData.replace(regex.from, regex.to)
                } else {
                    fileData = regex.to(regex.from, fileData)
                }
            }
        }
    }

    if (type == "build") {
        let outputFileDir = file.replace(resourceName, resourceName+"/build") // Add "/build" after the resource name
        let outputDir = outputFileDir.replace(VerEx().word().then(".lua"), "") // Remove "filename.lua"
    
        fs.mkdirSync(outputDir, {recursive: true})
        fs.writeFileSync(outputFileDir, fileData)
    } else {
        fs.writeFileSync(file, fileData) // Temp overwrite the file
    }
}

RegisterCommand("parser", (source, args) => {
    let [type, resourceName] = args

    if (!type || !resourceName) {
        console.log("parser restart <resource>")
        console.log("parser build <resource>")
        return
    }

    if (resourceName) {
        let resourcePath = GetResourcePath(resourceName)
        let start = performance.now()
        let files = []
        let prePostProcessFiles = {}

        files = GetAllResourceMetadata(resourceName, "client_script")
        files.push(...GetAllResourceMetadata(resourceName, "server_script"))


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
                for (let file of files) {
                    //console.log(file)
                    let fileDirectory = ResolveFile(resourcePath, file)
                    //console.log(fileDirectory)
                    
                    if (typeof fileDirectory != "string") {
                        for (let fileDir of fileDirectory) {
                            prePostProcessFiles[fileDir] = fs.readFileSync(fileDir, "utf-8")
                            PostProcess(resourceName, fileDir, type)
                        }
                    } else {
                        prePostProcessFiles[fileDirectory] = fs.readFileSync(fileDirectory, "utf-8")
                        PostProcess(resourceName, fileDirectory, type)
                    }
                }

                break;
        }

        console.log("Post processed in: "+chalk.green(performance.now() - start)+"ms")

        if (type == "restart") {
            // Explanation:
            // FiveM will read the files, cache them and start the resource with those cached files
            // as soon as it has started the resource we rewrite the old file so it looks like nothing happened
            // (this will be executed in very few ms (5/10) so it will look like it was never overwritten)

            // Restart the resource with the builded files
            StopResource(resourceName)
            StartResource(resourceName)

            for (let path in prePostProcessFiles) {
                fs.writeFileSync(path, prePostProcessFiles[path]) // Rewrite old file (before post process)
            }
        }
    }

}, false)