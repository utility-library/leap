import dedent from "dedent";
import VerEx from "verbal-expressions";
import { ReplaceFunctionEnding } from "../modules/functions";
import { sliceLine } from "../modules/linesManipulation";
import { MatchAllRegex } from "../modules/regex";
import { AddHook } from "./hooking";
import "../modules/string"

function classIterator(fileData, matchIndices) {
    const classFunctionTester = VerEx()
        .find("function")
        .maybe(" ")
        .then("(")
        .beginCapture()
            .anythingBut(")")
        .endCapture()
        .then(")")

    let lines;
    
    let originalFileData = fileData
    for (let i of matchIndices) {
        let slicedFile = originalFileData.slice(i);
        [_, startLine, endLine] = ReplaceFunctionEnding(fileData, slicedFile, null)

        let classBody = sliceLine(fileData, startLine, endLine + 1)
        lines = classBody.split("\n");

        let inFunction = false;
        let opening = ["(?<!else)if.*then", "function\\s*\\(", "while.*do", "for.*do"]
        let countEnds = 1;

        // self injection in the functions arguments
        for (i in lines) {
            let line = lines[i]
            
            if (!inFunction && classFunctionTester.test(line)) {
                classFunctionTester.lastIndex = 0; // reset
                let result = classFunctionTester.exec(line)
                
                if (result[1].length > 0) {
                    lines[i] = line.replace(classFunctionTester, "function(self, $1)")
                } else {
                    lines[i] = line.replace(classFunctionTester, "function(self)")
                }
                
                countEnds = 1;
                inFunction = true;
            } else if (inFunction) {
                for (e of opening) {
                    countEnds += line.occurrences(e)
                }
                
                countEnds -= line.occurrences("end")
                
                if (countEnds === 0) {
                    inFunction = false;
                }
            }
        }
        
        fileData = fileData.replace(classBody, lines.join("\n"))
    }

    return fileData
}

let classMatch = VerEx()
    .find("class")
    .maybe(" ")
    .beginCapture()
        .anythingBut(" ")
    .endCapture()
    .maybe(" ")
    .then("{")

let classExtendsMatch = VerEx()
    .find("class")
    .maybe(" ")
    .beginCapture()
        .anythingBut(" ")
    .endCapture()
    .maybe(" ")
    .find("extends")
    .maybe(" ")
    .beginCapture()
        .anythingBut(" ")
    .endCapture()
    .maybe(" ")

    .then("{")

let Class = {
    id: "class",
    from: classMatch,
    to: function(file) {
        let matchIndices = MatchAllRegex(file, classMatch).map(x => x.index);
        
        /* Beautified code, code is minified to help with error debugging
            $1 = function(...)
                local obj = setmetatable({__type = "$1"}, {
                    __index = function(self, key) 
                        return Prototype$1[key] 
                    end
                })

                if obj.constructor then
                    obj:constructor(...)
                end

                return obj
            end

            Prototype$1 = {
        */
        
        if (matchIndices.length > 0) {
            file = classIterator(file, matchIndices)

            file = file.replace(classMatch, dedent`
                $1=function(...)local a=setmetatable({__type = "$1"},{__index=function(self,b)return Prototype$1[b]end})if a.constructor then a:constructor(...)end;return a end;Prototype$1={
            `)
        }

        return file
    }
}

let ClassExtends = {
    id: "classExtends",
    from: classExtendsMatch,
    to: function(file) {
        let matchIndices = MatchAllRegex(file, classExtendsMatch).map(x => x.index);
        
        file = classIterator(file, matchIndices)
        
        /* Beautified code, code is minified to help with error debugging
            $1 = function(...)
                if Prototype$2 then
                    Prototype$1.super = setmetatable({}, {
                        __index = function(self, key)
                            return Prototype$2[key]
                        end,
                        __call = function(self, ...)
                            self.constructor(...)
                        end
                    })
                else
                    error("ExtendingNotDefined: trying to extend the class $2 but is not defined")
                end

                local obj = setmetatable({__type = "$1"}, {
                    __index = function(self, key) 
                        return Prototype$1[key] or Prototype$2[key] 
                    end
                })

                if obj.constructor then
                    obj:constructor(...)
                end

                return obj
            end

            Prototype$1 = {
        */

        return file.replace(classExtendsMatch, dedent`
            $1=function(...)if Prototype$2 then Prototype$1.super=setmetatable({},{__index=function(self,a)return Prototype$2[a]end,__call=function(self,...)self.constructor(...)end})else error("ExtendingNotDefined: trying to extend the class $2 that is not defined")end;local b=setmetatable({__type = "$1"},{__index=function(self,a)return Prototype$1[a]or Prototype$2[a]end})if b.constructor then b:constructor(...)end;return b end;Prototype$1={
        `)
    }
}

//#region Preservation of the class type 

/* Beautified code, code is minified to help with error debugging
    -- Type function wrapper to add classes type
    
    _type = type -- we preserve the original "type" function
    type = function(var)
        local realType = _type(var)

        if realType == "table" and var.__type then
            return var.__type
        else
            return realType
        end
    end
*/
AddHook(["class", "classExtends"], '_type=type;type=function(b)local realType=_type(b)if realType=="table"and b.__type then return b.__type else return realType end end')

//#endregion

//#region Sharing of instantiated objects between server > client and client > server

/* Beautified code, code is minified to help with error debugging
    local __reconvertToInstantiatedObject = function(params)    
        for k,v in ipairs(params) do
            if _type(v) == "table" and v.__type then -- if the real type its a table and have the __type variable (its an instantiated object)
                local class = _G[v.__type] -- get the class from current side (client/server)

                if class then -- if the class exist, recreate it from the insantiated object
                    params[k] = class()
                    
                    for _k, _v in pairs(v) do -- ovverride variables in the instantiated object
                        params[k][_k] = _v
                    end
                end
            end
        end

        return params
    end

    -- also works with RegisterServerEvent (https://github.com/citizenfx/fivem/blob/master/data/shared/citizen/scripting/lua/scheduler.lua#L358)
    local _RegisterNetEvent = RegisterNetEvent
    RegisterNetEvent = function(name, func)
        if name then
            if func then
                _RegisterNetEvent(name, function(...)
                    local params = {...}

                    if next(params) ~= nil then
                        params = __reconvertToInstantiatedObject(params)
                    end
                    
                    func(table.unpack(params))
                end)
            else
                _RegisterNetEvent(name)
            end
        end
    end

    local _AddEventHandler = AddEventHandler
    AddEventHandler = function(name, func)
        if name and func then
            _AddEventHandler(name, function(...)
                local params = {...}

                if next(params) ~= nil then
                    params = __reconvertToInstantiatedObject(params)
                end

                func(table.unpack(params))
            end)
        end
    end
*/
AddHook(["class", "classExtends"], 'local a=function(b)for c,d in ipairs(b)do if _type(d)=="table"and d.__type then local e=_G[d.__type]if e then b[c]=e()for f,g in pairs(d)do b[c][f]=g end end end end;return b end;local h=RegisterNetEvent;RegisterNetEvent=function(i,j)if i then if j then h(i,function(...)local b={...}if next(b)~=nil then b=a(b)end;j(table.unpack(b))end)else h(i)end end end;local k=AddEventHandler;AddEventHandler=function(i,j)if i and j then k(i,function(...)local b={...}if next(b)~=nil then b=a(b)end;j(table.unpack(b))end)end end')

//#endregion

export {Class, ClassExtends}
