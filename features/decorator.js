import {BasicFeature} from './basicFeature.js'
import luaparser from './leapparse.js';


import {markLoc, codeToAst, formatAst} from "../functions/utils.js";
import AstToCode from '../functions/astToCode.js';

import {walk as walker} from 'estree-walker';


var ast = luaparser.ast
var decorators = []

var decorator = codeToAst(`
    FUNCTION_NAME = DECORATOR(
        setmetatable({name = "FUNCTION_NAME"}, {
            __call = function(self, ...) return ORIGINAL_FUNCTION(...) end
        })
    )
`)

function saveOriginalFunction(node) {
    // Save the function as _function
    let originalFunction = ast.identifier("_"+node.identifier.name)
    originalFunction = markLoc(originalFunction, node.loc)

    // Save the original function as: local _function = function
    var originalFunctionLocal = ast.localStatement([originalFunction], [node.identifier])
    originalFunctionLocal = markLoc(originalFunctionLocal, node.loc)

    return originalFunctionLocal
}

function processDecorator(decorator) {
    var astToCode = new AstToCode(false);
    
    return astToCode.processAst(decorator)
}

class Decorator extends BasicFeature {
    shouldEdit(node, parent) {
        return node.type === "DecoratorStatement" || node.type === "FunctionDeclaration"
    }
    edit(node, parent, prop, index) {
        switch(node.type) {
            case "DecoratorStatement":
                decorators.push(node)
                this.remove()
                break

            case "FunctionDeclaration":
                if (decorators.length > 0) {
                    let nodes = []

                    // Add the original function to the nodes
                    var originalFunctionLocal = saveOriginalFunction(node)
                    nodes.push(originalFunctionLocal)

                    for (let _decorator of decorators) {
                        let processedDecorator = processDecorator(_decorator.base) // Get the code parsed ast

                        let decoratorNode = formatAst(decorator, {
                            name: {
                                ORIGINAL_FUNCTION: "_"+node.identifier.name,
                                FUNCTION_NAME: node.identifier.name,
                                DECORATOR: processedDecorator
                            },
                            raw: {
                                FUNCTION_NAME: node.identifier.name
                            }
                        }, node.loc)

                        // Inject the decorator arguments
                        decoratorNode.init[0].arguments.push(..._decorator.arguments)

                        nodes.push(decoratorNode)
                    }
              
                    // Insert the new nodes after the current node (the actual function declaration)
                    parent[prop].splice(index+1, 0, ...nodes)

                    decorators = []
                }
                break
        }
    }
}

export {Decorator}