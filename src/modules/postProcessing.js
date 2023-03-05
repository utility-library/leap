import VerEx from "verbal-expressions";
import glob from "glob"
import fs from "fs"
import {Features} from "../index"

let validWindowsPath = VerEx()
    .startOfLine()
    .range('a', 'z', 'A', 'Z')
    .find(":/")
    .beginCapture()
        .anythingBut("/")
        .then("/")
    .endCapture()
    .oneOrMore()

function ResolveFile(resourcePath, file) {
    if (file.includes("*") > 0) { // If have some glob
        return glob.sync(file, {cwd: resourcePath, absolute: true})
    } else {
        return resourcePath+"/"+file
    }
}

function PostProcess(resourceName, file, type, write = true) {
    let fileData = undefined;

    if (validWindowsPath.test(file)) {
        fileData = fs.readFileSync(file, "utf-8")
    } else {
        fileData = file
    }

    for (let feature of Features) {
        if (typeof feature.from == "string") {
            fileData = fileData.replace(feature.from, feature.to)
        } else {
            feature.from.removeModifier("g") // Prevent lastIndex from giving false negatives
            let match = feature.from.test(fileData)
            feature.from.addModifier("g")

            if (match) {
                if (typeof feature.to == "string") {
                    fileData = fileData.replace(feature.from, feature.to)
                } else {
                    fileData = feature.to(fileData)
                }
            }
        }
    }

    if (write) {
        if (type == "build") {
            let outputFileDir = file.replace(resourceName, resourceName+"/build") // Add "/build" after the resource name
            let outputDir = outputFileDir.replace(VerEx().word().then(".lua"), "") // Remove "filename.lua"
        
            fs.mkdirSync(outputDir, {recursive: true})
            fs.writeFileSync(outputFileDir, fileData)
        } else {
            fs.writeFileSync(file, fileData) // Temp overwrite the file
        }
    } else {
        return fileData
    }
}

export {ResolveFile, PostProcess}