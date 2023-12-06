//#region Modules
//import luaparse from 'luaparse';
import luaparse from "./features/leapparse.js"

import {walk as walker} from 'estree-walker';
import fs from 'fs';
import { GetHooks } from './functions/hooking.js'

//#endregion

//#region Features
import { Class } from './features/classes.js'
import { TypeChecking } from './features/typeChecking.js'
import { Decorator } from "./features/decorator.js";
import { DefaultValue } from "./features/defaultValue.js";
import { In } from "./features/in.js";
import { TableComprehension } from "./features/tableComprehension.js";

import AstToCode from './functions/astToCode.js'
//#endregion

let features = [new Class(), new TypeChecking(), new Decorator(), new DefaultValue(), new In(), new TableComprehension()]

async function PreprocessFile(filePath) {
    let file = fs.readFileSync(filePath, "utf8");
    var ast = luaparse.parse(file, {locations: true, luaVersion: "5.4"});

    var featuresUsed = {}
    // Edit ast according to features
    
    console.log("Before edit", JSON.stringify(ast))

    walker(ast, {
        enter(node, parent, prop, index) {
            for (let feature of features) {
                if (feature.shouldEdit.call(this, node, parent)) {
                    featuresUsed[feature.constructor.name] = true
                    
                    feature.edit.call(this, node, parent, prop, index)
                }
            }
        },
    })

    var hooks = GetHooks()
    for (let featureName in featuresUsed) {
        if (!hooks[featureName]) {
            continue
        }

        hooks[featureName].map((contentAst) => {
            ast.body.unshift(...contentAst.body)
        })
    }

    console.log("\n\nAfter edit", JSON.stringify(ast))
    var astToCode = new AstToCode()
    let code = await astToCode.processAst(ast)

    return code
}

let timer = Date.now()
let preprocessed = await PreprocessFile("tests/source.lua")
fs.writeFileSync("tests/preprocessed.lua", preprocessed)

console.log("Execution time:"+ (Date.now() - timer) + "ms")
