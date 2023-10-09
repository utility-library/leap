import luaparser from '../features/leapparse.js';
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

export {
    declareAstFunction,
    markLoc
}