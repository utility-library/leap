import {BasicFeature} from './basicFeature.js'
import luaparser from './leapparse.js';
import { AddHook } from '../functions/hooking.js';

var ast = luaparser.ast
var inFunctionCode = `
    leap_table_match = function(table, value)
        local needToMatch = 0
        local matched = 0

        for k1, v1 in pairs(value) do
            needToMatch = needToMatch + 1

            repeat 
                if v1.__exists then
                    if table[k1] then
                        matched = matched + 1
                    end
                    break
                end

                if v1.__type then
                    if type(table[k1]) == v1.__type then
                        matched = matched + 1
                    end

                    break
                end

                if v1.__match then
                    if type(table[k1]) == "string" and table[k1]:match(v1.__match) then
                        matched = matched + 1
                    end

                    break
                end

                if type(v1) == "table" then -- recursive
                    for k2, v2 in pairs(table) do
                        if type(v2) == "table" and leap_table_match(v1, v2) then
                            matched = matched + 1
                            break
                        end
                    end
                else
                    for k2, v2 in pairs(table) do
                        if v1 == v2 then
                            matched = matched + 1
                            break
                        end
                    end
                end
            until true
        end
        
        return matched == needToMatch
    end

    leap_in = function(value, tab, key)
        local _type = type(tab)

        if _type == "table" then
            if type(value) == "table" then
                return leap_table_match(tab, value)
            else
                for k, v in pairs(tab) do
                    local _v = key and v[key] or v
                    
                    if _v == value then
                        return true
                    end
                end
            end

        elseif _type == "string" then
            return tab:find(value)
        else
            error("in operator: unsupported type " .. _type)
        end

        return false
    end
`

class In extends BasicFeature {
    shouldEdit(node, parent) {
        return node.type === "InStatement" 
    }
    edit(node, parent) {

    }
}

AddHook("In", inFunctionCode)

export {In}
