import {BasicFeature} from './basicFeature.js'
import luaparser from './leapparse.js';
import {declareAstFunction, markLoc} from "../functions/utils.js";

var ast = luaparser.ast

// type(param) == "type"
function CheckForType(node) {
    var typeLiteral = markLoc(ast.literal(luaparser.tokenTypes.StringLiteral, node.attribute.name, '\"'+node.attribute.name+'\"'), node.loc)
    var typeFunction = declareAstFunction("type", [node.name], node.loc)

    var equal = markLoc(ast.binaryExpression("==", typeFunction, typeLiteral), node.loc)

    return equal
}

// "param: type expected, got " .. type(param)
function ErrorMessage(node) {
    var errorMsg = `${node.name.name}: ${node.attribute.name} expected, got `
    var typeFunction = declareAstFunction("type", [node.name], node.loc)

    var errorString = markLoc(ast.literal(luaparser.tokenTypes.StringLiteral, errorMsg, '\"'+errorMsg+'\"'), node.loc)
    var errorConcatWithType = markLoc(ast.binaryExpression("..", errorString, typeFunction), node.loc)

    return errorConcatWithType
}

// assert(type(param) == "type", "param: type expected, got " .. type(param))
function AssertType(node, type, errorMsg) {
    var assert = declareAstFunction("assert", [type, errorMsg], node.loc)

    return assert
}

class TypeChecking extends BasicFeature {
    shouldEdit(node, parent) {
        return node.type === "IdentifierWithTypeAttribute"
    }
    edit(node, parent) {
        var type = CheckForType(node)
        var errorMsg = ErrorMessage(node)
        var assert = AssertType(node, type, errorMsg)

        parent.body.unshift(assert) // add before the rest of the code

        // replace the "identifier with attribute" with only the basic "identifier" (in the function parameters)
        this.replace(node.name)
    }
}

export {TypeChecking}