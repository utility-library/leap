import {BasicFeature} from './basicFeature.js'
import luaparser from './leapparse.js';
import {declareAstFunction, markLoc} from "../functions/utils.js";
import { AddHook } from '../functions/hooking.js';

var ast = luaparser.ast

var classCode = `
classBuilder = function(name, prototype, baseClass)
    prototype.__type = name
    
    -- Will always be an empty table if not extending, so we check if the baseClass its nil (not defined) this mean that it tried to pass a class but it was not defined
    if not baseClass then
        error("ExtendingNotDefined: "..name.." tried to extend a class that is not defined", 2)
    end

    if baseClass.__prototype then
        prototype.super = setmetatable({}, {
            __index = function(self, key)
                return baseClass.__prototype[key]
            end,
            __call = function(self, ...)
                return baseClass(...)
            end
        })
    end

    _G[name] = setmetatable({__type = name, __prototype = prototype}, {
        __call = function(self, ...)
            local obj = setmetatable(self, {
                __index = function(self, key) 
                    if self.__prototype.super then
                        return self.__prototype[key] or self.__prototype.super[key]
                    else
                        return self.__prototype[key]
                    end
                end,
                __gc = function(self)
                    if self.destructor then
                        self:destructor()
                    end
                end
            })
    
            if obj.constructor then
                obj:constructor(...)
            end
    
            return obj
        end
    })
end
`

function GetBaseClass(node) {
    if (node.extends) {
        return node.extends
    } else {
        // Empty table
        var loc = {start: node.loc.end, end: node.loc.end}
        return markLoc(ast.tableConstructorExpression({}), loc)
    }
}

function InjectSelfInFunctions(table) {
    table.fields.forEach((field) => {
        if (field.value.type == "FunctionDeclaration") {
            var loc = {
                // its not a typo, we want it to be at the same line, only the line its taken in consideration, column its ignored, yet (so its not a problem copying directly the location)
                start: field.value.loc.start,
                end: field.value.loc.start
            }
            var self = markLoc(ast.identifier("self"), loc)
            
            field.value.parameters.unshift(self)
        } 
    })

    return table
}

function GetName(node) {
    return markLoc(
        ast.literal(
            luaparser.tokenTypes.StringLiteral, 
            node.identifier.name, 
            '\"'+node.identifier.name+'\"'
        ), 
        node.identifier.loc
    )
}

class Class extends BasicFeature {
    shouldEdit(node, parent) {
        return  node.type === "ClassStatement" 
    }
    edit(node, parent) {
        var table = node.body
        table.loc.start.line -= 1; // Remove a space that the tokenizer detect when reading the class body initiator 
        table = InjectSelfInFunctions(table)

        var name = GetName(node)
        var baseClass = GetBaseClass(node)
        
        // Create classBuilder
        var classBuilder = declareAstFunction("classBuilder", [name, table, baseClass], node.loc)

        this.replace(classBuilder)
    }
}

AddHook("Class", classCode)

export {Class}