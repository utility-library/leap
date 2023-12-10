//#region Modules
import fs from 'fs';
//#endregion

import { preprocessFileSync } from "./functions/api.js";

let timer = Date.now()
let preprocessed = preprocessFileSync("tests/source.lua")
fs.writeFileSync("tests/preprocessed.lua", preprocessed)

console.log("Execution time:"+ (Date.now() - timer) + "ms")
