import VerEx from "verbal-expressions";
import glob from "glob"
import fs from "fs"
import {Features} from "../index"
import { HookFunctionsOfMatched } from "../features/hooking";

function ResolveFile(resourcePath, file) {
    if (file.includes("*") > 0) { // If have some glob
        return glob.sync(file, {cwd: resourcePath, absolute: true})
    } else {
        return resourcePath+"/"+file
    }
}

function PostProcess(resourceName, file, type, write = true) {
    let fileData = (type == "build") ? fs.readFileSync(file, "utf-8") : file;
    let matchedFeatures = []

    for (let feature of Features) {
        if (typeof feature.from == "string") {
            fileData = fileData.replace(feature.from, feature.to)
        } else {
            feature.from.removeModifier("g") // Prevent lastIndex from giving false negatives
            let match = feature.from.test(fileData)
            feature.from.addModifier("g")

            if (match) {
                matchedFeatures.push(feature.id)

                if (typeof feature.to == "string") {
                    fileData = fileData.replace(feature.from, feature.to)
                } else {
                    fileData = feature.to(fileData)
                }
            }
        }
    }

    fileData = HookFunctionsOfMatched(fileData, matchedFeatures)

    if (type == "build") {
        let outputFileDir = file.replace(resourceName, resourceName+"/build") // Add "/build" after the resource name
        let outputDir = outputFileDir.replace(VerEx().word().then(".lua"), "") // Remove "filename.lua"
    
        fs.mkdirSync(outputDir, {recursive: true})
        fs.writeFileSync(outputFileDir, fileData)
    } else {
        return fileData
    }
}

export {ResolveFile, PostProcess}