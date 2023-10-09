import {BasicFeature} from './basicFeature.js'
import {replaceAfterChar} from "../utils.js"
import luamin from 'luamin';

var classCode = luamin.minify(`
    className = function(...)
    local obj = setmetatable({__type = "className"}, {
        __index = function(self, key) 
            return PrototypeclassName[key] 
        end
    })

    if obj.constructor then
        obj:constructor(...)
    end

    return obj
    end

    PrototypeclassName = {}
`)

class Class extends BasicFeature {
    shouldEdit(node, parent) {
        return  node.type === "AssignmentStatement" && 
                node.variables &&
                node.variables[0].name == "class" &&
                node.init &&
                node.init[0].type === "TableCallExpression" &&
                node.init[0].base.type === "Identifier"
    }
    edit(file, node, parent) {
        let classNameNode = node.init[0].base
        
        // Remove "class"
        node.variables[0].name = ""
        file = replaceAfterChar(file, node.range[0], /\S*class\S*/, "") // Update code

        // Replace "className" with the code
        var _classCode = classCode
        _classCode = _classCode.replace(/className/g, classNameNode.name)
        _classCode = _classCode.slice(0, -2) // Remove brackets

        // Already apply offset to classNameNode range
        let range = [classNameNode.range[0]-5, classNameNode.range[1]-5]
        
        file = replaceAfterChar(file, range[0], new RegExp(`\S*${classNameNode.name}\S*`), _classCode)

        // Inject self in functions inside the class
        for (let field of node.init[0].arguments.fields) {
            if (field.value.type === "FunctionDeclaration") {
                let range = [field.range[0] + _classCode.length, field.range[1] + _classCode.length] // Add the clas code length

                if (field.value.parameters.length == 0) {
                    console.log(file.slice(range[0], -1))
                    file = replaceAfterChar(file, range[0], "function(", "function(self")
                } else {
                    file = replaceAfterChar(file, range[0], "function(", "function(self, ")
                }

                field.value.parameters.push("self")
            }
        }

        // "class" string length its 5
        const offset = -5
        return [file, offset]
    }
}

export {Class}