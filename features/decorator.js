import {BasicFeature} from './basicFeature.js'
import luaparser from './leapparse.js';

import {markLoc, codeToAst} from "../functions/utils.js";
import {walk as walker} from 'estree-walker';

var ast = luaparser.ast
var decorators = []
var metatable = codeToAst(`
    setmetatable({name = "FUNCTION_NAME"}, {
        __call = function(self, ...) return _FUNCTION_NAME(...) end
    })
`)

function convertDecorator(func, decorator, metatable) {
    let functionName = markLoc(ast.identifier(func.identifier.name), func.loc)

    // Functions arguments
    let variables = [
        metatable,
        ...decorator.arguments // Arguments used directly in the decorator call
    ]

    // We need to create the function "manually" without using the declareAstFunction function why the base can be also MemberExpression etc, not only an Identifier
    var decoratorCallExp = ast.callExpression(
        markLoc(decorator.base, func.loc),
        variables
    )
    // Preserve the location
    decoratorCallExp = markLoc(decoratorCallExp, func.loc) // Preserve the location
    
    var decoratorCallStatement = ast.callStatement(decoratorCallExp)
    decoratorCallStatement = markLoc(decoratorCallStatement, func.loc) // Preserve the location
    
    // Create the assignment node
    let decoratorNode = ast.assignmentStatement([functionName], [decoratorCallStatement])
    decoratorNode = markLoc(decoratorNode, func.loc)

    return decoratorNode
}

function prepareMetatable(node) {
    walker(metatable, {
        enter(_node, parent, prop, index) {
            _node = markLoc(_node, node.loc)

            if (_node.name?.search("FUNCTION_NAME") > -1) {
                _node.name = _node.name.replace("FUNCTION_NAME", node.identifier.name)
            }
            
            if (_node.raw?.search("FUNCTION_NAME") > -1) {
                _node.raw = _node.raw.replace("FUNCTION_NAME", node.identifier.name)
            }

            this.replace(_node)
        }
    })
}

class Decorator extends BasicFeature {
    shouldEdit(node, parent) {
        return node.type === "DecoratorStatement" || node.type === "FunctionDeclaration"
    }
    edit(node, parent, prop, index) {
        switch(node.type) {
            case "DecoratorStatement":
                console.log("Add this node to decorators")
                decorators.push(node)
                this.remove()
                break

            case "FunctionDeclaration":
                if (decorators.length > 0) {
                    let nodes = []

                    let savedFunction = ast.localStatement([markLoc(ast.identifier("_"+node.identifier.name), node.loc)], [node.identifier])
                    savedFunction = markLoc(savedFunction, node.loc)

                    nodes.push(savedFunction)
                    prepareMetatable(node)
                    
                    for (let decorator of decorators) {
                        let decoratorNode = convertDecorator(node, decorator, metatable)
                        nodes.push(decoratorNode)
                    }
              
                    // Insert the new nodes after the current node (function declaration)
                    parent[prop].splice(index+1, 0, ...nodes)

                    decorators = []
                }
                break
        }
    }
}

export {Decorator}