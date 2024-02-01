// This files exists only for testing purposes

//#region Modules
import fs from 'fs';
//#endregion

import { preprocessFileSync } from "./functions/api.js";

let timer = Date.now()

console.log("Starting preprocessing source") // To differentiate logs from features and actual source code

let preprocessed = preprocessFileSync("tests/source.lua")
fs.writeFileSync("tests/preprocessed.lua", preprocessed)

console.log("Execution time:"+ (Date.now() - timer) + "ms")
