import { walk } from "estree-walker";
import luaparse from "../features/leapparse.js"

import luamin from "luamin";
var ast = luaparse.ast


function declareAstFunction(name, params, loc) {
    var name = markLoc(ast.identifier(name), loc)

    var exp = markLoc(ast.callExpression(
        name,
        params
    ), loc)

    var statement = markLoc(ast.callStatement(exp), loc)

    return statement
}

function markLoc(block, loc) {
    block.loc = loc

    return block
}

function markAstLoc(ast, loc) {
    walk(ast, {
        enter(node) {
            node.loc = loc
        }
    })

    return ast
}

function formatAst(ast, replace, loc) {
    let cloned = structuredClone(ast)

    walk(cloned, {
        enter(node) {
            // Replace every node occurence
            for (const [nodeKey, toReplace] of Object.entries(replace)) {
                if (node[nodeKey]) {

                    if (nodeKey == "raw") {
                        for (const [key, value] of Object.entries(toReplace)) {
                            node[nodeKey] = node[nodeKey].replace(key, value)
                        }
                    } else {
                        // Replace the value that need to be replaced
                        node[nodeKey] = toReplace[node[nodeKey]] || node[nodeKey]
                    }
                }
            }

            if (loc) {
                node.loc = loc
            }
        }
    })

    return cloned
}

function codeToAst(code) {
    code = luamin.minify(code)

    let ast = luaparse.parse(code, {locations: true, luaVersion: "5.4"})
    ast = ast.body[0]

    return ast
}

export {
    declareAstFunction,
    markLoc,
    markAstLoc,
    formatAst,
    codeToAst
}