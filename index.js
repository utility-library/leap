import fs from 'fs'
import glob from "glob"

import {
    Natives
} from './modules/natives.js'

function ReadFile(file) {
    return fs.readFileSync(`./tests/${file}`, {encoding: "utf-8"})
}

//console.log(ReadFile("test.lua"))

/*
RegisterCommand("_restart", (source, args) => {
    let [resourceName] = args

    let resourcePath = GetResourcePath(resourceName)

    glob(`${resourcePath}/.lua`, (err, files) => {
        console.log(files)
    })
})
*/

glob(`tests/**/*.lua`, (err, files) => {
    console.log(files)
})