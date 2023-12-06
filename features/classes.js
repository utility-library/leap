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
        __index = function(self, key)
            if self.__prototype.super then
                return self.__prototype[key] or self.__prototype.super[key]
            else
                return self.__prototype[key]
            end
        end,
        __newindex = function(self, k, v)
			if k:sub(1, 2) == "__" then
				rawset(self, k, v)
			else
				error("attempt to assign class property '"..k.."' directly, please instantiate the class before assigning any properties", 2)
			end
        end,
        __call = function(self, ...)
            -- Create new object
            local obj = setmetatable({__type = self.__type}, {
                __index = function(_self, key) 
                    if self.__prototype.super then
                        return self.__prototype[key] or self.__prototype.super[key]
                    else
                        return self.__prototype[key]
                    end
                end,
                __gc = function(_self)
                    if _self.destructor then
                        _self:destructor()
                    end
                end
            })
    
            if not self.__skipNextConstructor then
                if obj.constructor then
                    obj:constructor(...)
                end
            else
                self.__skipNextConstructor = nil
            end
    
            return obj
        end
    })
end

if not leap then leap = {} end

-- Function to deserialize objects (example: objects sended over the network)
leap.deserialize = function(class)
    if type(class) == "table" and class.__type then
        local _class = _G[class.__type]

        if _class then
            _class.__skipNextConstructor = true -- Skip next constructor call
            local obj = _class()

            -- Copy all properties to the new instantiated object
            for k, v in pairs(class) do
                obj[k] = v
            end

			return obj
        else
            error("Class '"..class.__type.."' not found", 2)
        end
    end
end

-- Type override (allow custom types)
if not _type then
    _type = type -- we preserve the original "type" function
    type = function(var)
        local realType = _type(var)

        if realType == "table" and var.__type then
            return var.__type
        else
            return realType
        end
    end
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