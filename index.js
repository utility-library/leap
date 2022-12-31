import fs from 'fs'
import glob from "glob"
import VerEx from 'verbal-expressions'
import chalk from 'chalk'
import { performance } from 'perf_hooks'


import {
    Natives
} from './modules/natives.js'

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
            
            .beginCapture() // Get function content
                .then(VerEx() // then is used to create a Non-capturing group
                    .anythingBut("{}")
                    .or(VerEx()
                        .find("{")
                        .anythingBut("{}")
                        .find("}")
                    )
                ).oneOrMore() // Repeate
            .endCapture()
            .find("}")
        ,
        to: "function($1)$2end"
    }
]

function GetResourcePath(resourceName) {
    return `./resources/${resourceName}`
}

// Fake implementation of LoadResourceFile
function LoadResourceFile(resourceName, file) {
    return fs.readFileSync(`./resources/${resourceName}/${file}`, {encoding: "utf-8"})
}

function MatchRegex(pattern, text) {
    let regex = new RegExp(pattern)

    return regex.exec(text)
}

function ExtractFilesFromScripts(scripts) {
    let files = scripts.match(/(?<!--)(["'])(.+?)\1/g) // Exclude match starting with --
    files = files.map(v => v.replace(/["']/g, "")) // Remove double/single qoutation mark
    
    return files
}

function GetScriptsFromManifest(type, manifest) {
    let isMulti = MatchRegex(`${type}_scripts`, manifest)

    if (isMulti) {
        let clientScripts = MatchRegex(`${type}_scripts\\s*\{([^\{\}]*)\}`, manifest)
    
        if (clientScripts) {
            return ExtractFilesFromScripts(clientScripts[1])
        }
    } else {
        /*
            \s*: This matches zero or more whitespace characters.
            (["']): This matches either a double quote or a single quote and captures it in a capturing group.
            (.+?): This matches one or more characters (any character except a newline) lazily (as few as possible) and captures the match in a capturing group. The ? after the + makes the + lazy, meaning that it will match as few characters as possible.
            \1: This matches the same text as the first capturing group. In this case, it will match either a double quote or a single quote, depending on which one was captured in the first capturing group.
        */
        let clientScript = MatchRegex(`${type}_script\\s*["'](.+?)["']`, manifest)

        if (clientScript) {
            return clientScript[2]
        }
    }
}

function ResolveFile(resourcePath, file) {
    if (file.includes("*") > 0) { // If have some glob
        return resourcePath+"/"+glob.sync(file)
    } else {
        return resourcePath+"/"+file
    }
}

function PostProcess(file, compiled) {
    let fileData = fs.readFileSync(file, "utf-8")

    for (let regex of Regexes) {
        if (regex.from.test(fileData)) {
            fileData = fileData.replace(regex.from, regex.to)
        }
    }

    fs.writeFileSync("./resources/test/client/processed.lua", fileData)
}

function Command(source, args) {
    let [resourceName] = args

    let resourcePath = GetResourcePath(resourceName)
    let manifest = LoadResourceFile(resourceName, "fxmanifest.lua")

    let files = GetScriptsFromManifest("client", manifest)
    let start = performance.now()

    for (let file of files) {
        let fileDirectory = ResolveFile(resourcePath, file)
        
        PostProcess(fileDirectory)
    }

    console.log("Post processed in: "+chalk.green(performance.now() - start)+"ms")
}

// Fake command execution
Command(0, ["test"])


/*
RegisterCommand("_restart", (source, args) => {
    let [resourceName] = args

    let resourcePath = GetResourcePath(resourceName)

    glob(`${resourcePath}/.lua`, (err, files) => {
        console.log(files)
    })
})
*/


//glob(`tests/**/*.lua`, (err, files) => {
//    console.log(files)
//})


const a = (asd) => {

}