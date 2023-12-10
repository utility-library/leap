//#region Modules
import luaparse from "../features/leapparse.js"

import fs from 'fs';
//#endregion

//#region Features
import { Class } from '../features/classes.js'
import { TypeChecking } from '../features/typeChecking.js'
import { Decorator } from "../features/decorator.js";
import { DefaultValue } from "../features/defaultValue.js";
import { In } from "../features/in.js";
import { TableComprehension } from "../features/tableComprehension.js";
//#endregion

import AstToCode from './astToCode.js'
import { GetHooks } from './hooking.js'
import { applyFeaturesToAst, injectHooks } from "./utils.js";


var featuresClasses = {
    class: new Class(), 
    typeChecking: new TypeChecking(),
    decorator: new Decorator(), 
    defaultValue: new DefaultValue(), 
    in: new In(), 
    tableComprehension: new TableComprehension()
}

var defaultFeaturesStatus = {
    class: true, 
    typeChecking: true,
    decorator: true, 
    defaultValue: true, 
    in: true, 
    tableComprehension: true
}

function preprocess(code, featuresStatus) {
    return new Promise((resolve, reject) => {
        try {
            resolve(preprocessSync(code, featuresStatus))
        } catch (error) {
            reject(error)
        }
    })
}

function preprocessFile(filePath, featuresStatus) {
    return new Promise((resolve, reject) => {
        try {
            resolve(preprocessFileSync(filePath, featuresStatus))
        } catch (error) {
            reject(error)
        }
    })
}

function preprocessSync(code, featuresStatus) {
    featuresStatus = Object.assign({}, defaultFeaturesStatus, featuresStatus)

    // Load active features
    var features = []

    for (let featureName in featuresStatus) {
        if (featuresStatus[featureName]) {
            features.push(featuresClasses[featureName])
        }
    }

    // Parse code
    var ast = luaparse.parse(code, {locations: true, luaVersion: "5.4", comments: false});

    var featuresFound = applyFeaturesToAst(ast, features)
    injectHooks(ast, featuresFound)

    // Regenerate code from AST
    var astToCode = new AstToCode()
    return astToCode.processAst(ast)
}

function preprocessFileSync(filePath, featuresStatus) {
    let file = fs.readFileSync(filePath, "utf8");
    
    return preprocessSync(file, featuresStatus)
}


export {
    preprocess, preprocessFile, 
    preprocessSync, preprocessFileSync
}