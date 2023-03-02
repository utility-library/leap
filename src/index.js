import fs from 'fs'
import { performance } from 'perf_hooks'

import glob from "glob"
import VerEx from 'verbal-expressions'
import chalk from 'chalk'
import dedent from "dedent"
import {GetAllResourceMetadata} from "./modules/manifest.js"
import {MatchRegex, MatchAllRegex} from "./modules/regex.js"

import {Natives} from './modules/natives.js'
import { exec } from 'child_process'

function classIterator(fileData, matchIndices) {
    const classFunctionTester = VerEx().find("function").maybe(" ").then("(")
    let lines;
    //console.log(matchIndices)
    for (let i of matchIndices) {
        let linesAfterMatch = fileData.slice(i);
        [fileData,lastLine] = ReplaceFunctionEnding(fileData, linesAfterMatch, "}")
        const lineStart = Number(String(fileData).substring(0, i).occurrences("\n") + 1);
        lines = fileData.split("\n");
        let inFunction = false;
        let countEnds;
        lastLine = Number(lastLine) + lineStart
        for (let j = lineStart; j <= lastLine; j++) {
            const line = lines[j];

            //console.log(inFunction)
            if (!inFunction && classFunctionTester.test(line)) {
                lines[j] = line.replace(line.match(classFunctionTester.toRegExp()), "function(self,")
                
                countEnds = 1;
                inFunction = true;
            } else if (inFunction) {
                countEnds += line.occurrences("if") + line.occurrences("function")
                countEnds -= line.occurrences("end")

                if (countEnds === 0) {
                    inFunction = false;
                }
            }
        }
        
        fileData = lines.join("\n")
    }

    return fileData
}

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
                let linesAfterMatch = fileData.slice(i);
                [fileData] = ReplaceFunctionEnding(fileData, linesAfterMatch)
            } 
            
            fileData = fileData.replace(regExp, "function($1)")
            //console.log("FileData:", fileData)

            return fileData
        },
    },
    {
        from: VerEx()
            // Get parameter
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
                let linesAfterMatch = fileData.slice(i);
                [fileData] = ReplaceFunctionEnding(fileData, linesAfterMatch)
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

            fileData = classIterator(fileData, matchIndices)
            
            /* Beautified code, code is minified to help with error debugging
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
            */

            return fileData.replace(verbalEx, dedent`
                $1=function(...)local a=setmetatable({},{__index=function(self,b)return Prototype$1[b]end})if a.constructor then a:constructor(...)end;return a end;Prototype$1={
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
            
            fileData = classIterator(fileData, matchIndices)
            
            /* Beautified code, code is minified to help with error debugging
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
            */

            return fileData.replace(verbalEx, dedent`
                $1=function(...)if Prototype$2 then Prototype$1.super=setmetatable({},{__index=function(self,a)return Prototype$2[a]end,__call=function(self,...)self.constructor(...)end})else error("ExtendingNotDefined: trying to extend the class $2 that is not defined")end;local b=setmetatable({},{__index=function(self,a)return Prototype$1[a]or Prototype$2[a]end})if b.constructor then b:constructor(...)end;return b end;Prototype$1={}
            `)
        }
    },
    {
        from: VerEx()
            .find("function")
            .maybe(" ")
            .maybe(VerEx().word())
            .beginCapture()
                .then("(")
                .anythingBut("()")
                .then(")")
            .endCapture()
        ,
        to: function(verbalEx, fileData) {
            let regExp = verbalEx.toRegExp()
            let matches = MatchAllRegex(fileData, regExp);
            let defaultValueRegex = VerEx()
                .beginCapture()
                    .word()
                .endCapture()
                
                .maybe(" ")
                .then("=")
                .maybe(" ")
                
                .beginCapture()
                    .anythingBut(",)")
                .endCapture()
                
            matches.map(x => {
                let regExp = defaultValueRegex.toRegExp()
                let matches = MatchAllRegex(x[1], regExp)
                
                // If have matched something
                if (matches.length > 0) {
                    let linesAfterMatch = fileData.slice(x.index, x.index + 100) // takes only the next 200 characters to optimize the replacing, should be enough for all the parameters                     
                    let originalLinesAfterMatch = linesAfterMatch
                    let defaultValueCheckZone = linesAfterMatch.slice(x[0].length, 100)

                    let originalDefaultValueCheckZone = defaultValueCheckZone    

                    matches.map(match => {
                        // add the default value check 
                        defaultValueCheckZone =
                            `;${match[1]} = ${match[1]} ~= nil and ${match[1]} or ${match[2]}` +  // key = key ~= nil and value or defaultValue
                            defaultValueCheckZone
                            
                        // remove the default value in the parameters
                        let regexEscaped = match[2].replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") // Escaped all regex special character
                        let noExecutablePart = new RegExp("\\s?=\\s?"+regexEscaped, 'gm') // " = value"

                        linesAfterMatch = linesAfterMatch.replace(noExecutablePart, "")
                    })
                        
                    linesAfterMatch = linesAfterMatch.replace(originalDefaultValueCheckZone, defaultValueCheckZone) // add the check
                    fileData = fileData.replace(originalLinesAfterMatch, linesAfterMatch)
                }
            })
            
            return fileData
            /*return fileData.replace(regExp, dedent`
                function($1)
            `)*/
        }
    },
    {
        from: VerEx()
            .find("...")
            .not(",")
            .beginCapture()
                .anything()
            .endCapture()
            .endOfLine()
        ,
        to: function(verbalEx, fileData) {
            let regExp = verbalEx.toRegExp()
            
            MatchAllRegex(fileData, regExp).map(x => {
                let file = fileData.slice(x.index)
                let originalFile = file

                file = file.replace(`...${x[1]}`, `table.unpack(${x[1]})`)
                fileData = fileData.replace(originalFile, file)
            });
            
            return fileData
        },
    },

    {
        from: VerEx().find("new ").beginCapture().word().then("(").endCapture(),

        to: (verbalEx, fileData) => {
            let regExp = verbalEx.toRegExp()
            //let matchIndices = MatchAllRegex(fileData, regExp).map(x => x.index);
            
            return fileData.replace(verbalEx, "$1")
        }
    }

    /*
    {
        from: VerEx()
        .find("Prototype")
        .beginCapture()
            .word()
        .endCapture()
        .then(" = {"),

        to: function(verbalEx, fileData) {
            let regExp = verbalEx.toRegExp()
            let matchIndices = MatchAllRegex(fileData, regExp).map(x => x.index);
            const lines = fileData.split("\n")
            const tester = VerEx().find("function").maybe(" ").then("(")

            

            for (let matchedLine of matchIndices) {
                let count = 0;
                const line = String(fileData).substring(0, matchedLine).occurrences("\n") + 1 // Zero based + gotta start from the line next

                console.log(line)
                for (let i = line; true; i++) {
                    let line = lines[i];
                    count += line.occurrences("{")
                    count -= line.occurrences("}")
                    if (tester.test(line)) {
                        console.log(line.match(tester.toRegExp()))
                        line = line.replace(line.match(tester.toRegExp()), "function(self, ")
                        lines[i] = line;
                    }

                    if (count === 0) {
                        break;
                    }
                }
            }
            
            return lines.join("\n")
        }
    }
    */
]

String.prototype.occurrences = function(string) {
    let regex = new RegExp(string, "g")

    return (this.match(regex) || []).length
}

function ReplaceFunctionEnding(string, linesAfterMatch, to = "end", from = "{", ending = "}") {
    let lineByLine = linesAfterMatch.split("\n") // Unpack lines
    let i;
    let curlyBracesCounter = 0
    for (i in lineByLine) {
        let line = lineByLine[i]
        
        curlyBracesCounter += line.occurrences(from)
        curlyBracesCounter -= line.occurrences(ending)

        //console.log(curlyBracesCounter)
        if (curlyBracesCounter == 0) {
            if (to) {
                lineByLine[i] = line.replace(ending, to)
            }
            break
        }
    }
    
    return [string.replace(linesAfterMatch, lineByLine.join("\n")), i] // Pack lines
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
    if (source != 0) return // only server side can use the command

    let [type, resourceName] = args

    if (type == "rebuild" && !resourceName) { // esbuild rebuild from cfx.re server
        let resourceName = GetCurrentResourceName()
        let path = GetResourcePath(resourceName)

        let runBuild = exec("npm run build", {cwd: path})

        runBuild.on("close", () => {
            console.log("Done")
        })
        return
    }

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

}, true)