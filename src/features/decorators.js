import VerEx from "verbal-expressions";
import { ReplaceFunctionEnding } from "../modules/functions";
import { getChars, getLine, sliceLine } from "../modules/linesManipulation";
import { MatchAllRegex } from "../modules/regex";

let match = VerEx()
    // decorators
    .beginCapture()
        .find("@")
        .word()
        .maybe(VerEx()
            .find("(")
            .anythingBut("()")
            .find(")")
        )
        .maybe(VerEx().lineBreak())
    .endCapture().oneOrMore()

    // line break after the decorators
    .maybe(VerEx().lineBreak())

    // with name = function()
    .maybe(VerEx()
        // maybe local
        .maybe(VerEx()
            .find("local")
            .maybe(" ")
        )

        // function name
        .beginCapture()
            .word()
        .endCapture()

        .maybe(" ")
        .find("=")
        .maybe(" ")
    )

    .then("function")
    .maybe(" ")

    // function name()
    .maybe(VerEx()
        .beginCapture()
            .anythingBut("(")
        .endCapture()
    )

    .then("(")

let decoratorsVerEx = VerEx()
    .find("@")
    .beginCapture()
        .word() // decorator name
    .endCapture()
    .maybe(VerEx() // params
        .find("(")
        .beginCapture()
            .anythingBut("()")
        .endCapture()
        .find(")")
    )

let Decorators = {
    from: match,
    to: function(file) {
        MatchAllRegex(file, match).map(match => {
            // match[0] = matched sentence
            // match[2] = function name
            let functionName = match[2] || match[3]
            let decorators = MatchAllRegex(match[0], decoratorsVerEx) // extract the decorators

            let line = getLine(file, match[0]) // get the matched function line 
            let slicedFile = sliceLine(file, line+(decorators.length)); // get all lines after the decorators

            // used in this way (with undefined as replace) does not actually replace the character, but simply gets where the function starts and ends
            let [_, startLine, endLine] = ReplaceFunctionEnding(file, slicedFile, null, ["if", "function", "while", "for"], "end")
            
            startLine -= (decorators.length) // include decorators

            // function content its the actual function delimited with also the decorators, example:
            /*
                @stopwatch
                function test(a, b, pow)
                    return math.pow(a*b, pow)
                end
            */

            let functionContent = sliceLine(file, startLine, endLine + 1)
            functionContent = functionContent.slice(0, -2) // remove the /r and /n characters to wrap in the line so that it is all in one line

            let originalFunctionContent = functionContent

            /* Beautified code, code is minified to help with error debugging
                local _${functionName} = ${functionName}; -- we save the old function

                ${functionName}FunctionPrototype = setmetatable({
                    name = "${functionName}"
                }, {
                    __call = function(self, ...) 
                        return _${functionName}(...) 
                    end
                })
            */
            functionContent += `;local _${functionName}=${functionName};${functionName}FunctionPrototype=setmetatable({name="${functionName}"},{__call=function(self,...)return _${functionName}(...)end})`
            
            decorators.map(decorator => {
                functionContent = functionContent.replace(decorator[0], "") // remove the decorator

                if (decorator[2]) { // if have parameters
                    /* Beautified code, code is minified to help with error debugging
                        if not ${decorator[1]} then  
                            error("DecoratorNotDefined: trying to use the decorator ${decorator[1]} but is not defined", 1)
                        end
                        
                        ${functionName} = ${decorator[1]}(${functionName}FunctionPrototype, ${decorator[2]})
                    */

                    functionContent += `;if not ${decorator[1]} then error("DecoratorNotDefined: trying to use the decorator ${decorator[1]} but is not defined",2)end;${functionName}=${decorator[1]}(${functionName}FunctionPrototype,${decorator[2]})`
                } else {
                    /* Beautified code, code is minified to help with error debugging
                        if not ${decorator[1]} then  
                            error("DecoratorNotDefined: trying to use the decorator ${decorator[1]} but is not defined", 1)
                        end
                        
                        ${functionName} = ${decorator[1]}(${functionName}FunctionPrototype)
                    */
                    
                    functionContent += `;if not ${decorator[1]} then error("DecoratorNotDefined: trying to use the decorator ${decorator[1]} but is not defined",2)end;${functionName}=${decorator[1]}(${functionName}FunctionPrototype)`
                }
            })

            file = file.replace(originalFunctionContent, functionContent)
        })

        return file
    }
}

export {Decorators}