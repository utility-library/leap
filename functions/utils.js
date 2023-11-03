import luaparser from '../features/leapparse.js';
import luaparse from "../features/leapparse.js"

import luamin from "luamin";
var ast = luaparser.ast


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

function codeToAst(code) {
    code = luamin.minify(code)

    let ast = luaparse.parse(code, {locations: true, luaVersion: "5.4"})
    ast = ast.body[0]

    return ast
}

export {
    declareAstFunction,
    markLoc,
    codeToAst
}