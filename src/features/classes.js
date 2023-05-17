import dedent from "dedent";
import VerEx from "verbal-expressions";
import { ReplaceFunctionEnding } from "../modules/functions";
import { sliceLine } from "../modules/linesManipulation";
import { MatchAllRegex } from "../modules/regex";
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
    from: classMatch,
    to: function(file) {
        let matchIndices = MatchAllRegex(file, classMatch).map(x => x.index);
        
        /* Beautified code, code is minified to help with error debugging
            $1 = function(...)
                local obj = setmetatable({}, {
                    __index = function(self, key) 
                        return Prototype$1[key] 
                    end
                })

                if obj.constructor then
                    obj:constructor(...)
                end

                return obj
            end

            -- Type function wrapper to add classes type (is here in order not to add a line to the beginning of the file and thus shred the stack traceback lines)
            -- We check to see if there is already a class that has overridden the type function so that there is no stack overflow
            
            if not _type then
                _type = type
                type = function(var)
                    local realType = _type(var)

                    if realType == "table" and var.type then
                        return var.type
                    else
                        return realType
                    end
                end
            end

            Prototype$1 = {type = "$1",
        */
        
        if (matchIndices.length > 0) {
            file = classIterator(file, matchIndices)

            file = file.replace(classMatch, dedent`
                $1=function(...)local a=setmetatable({},{__index=function(self,b)return Prototype$1[b]end})if a.constructor then a:constructor(...)end;return a end;if not _type then _type=type;type=function(b)local realType=_type(b)if realType=="table"and b.type then return b.type else return realType end end end;Prototype$1={type = "$1",
            `)
        }

        return file
    }
}

let ClassExtends = {
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

                local obj = setmetatable({}, {
                    __index = function(self, key) 
                        return Prototype$1[key] or Prototype$2[key] 
                    end
                })

                if obj.constructor then
                    obj:constructor(...)
                end

                return obj
            end

            Prototype$1 = {type = "$1",
        */

        return file.replace(classExtendsMatch, dedent`
            $1=function(...)if Prototype$2 then Prototype$1.super=setmetatable({},{__index=function(self,a)return Prototype$2[a]end,__call=function(self,...)self.constructor(...)end})else error("ExtendingNotDefined: trying to extend the class $2 that is not defined")end;local b=setmetatable({},{__index=function(self,a)return Prototype$1[a]or Prototype$2[a]end})if b.constructor then b:constructor(...)end;return b end;Prototype$1={type = "$1",
        `)
    }
}

export {Class, ClassExtends}
