import VerEx from "verbal-expressions";
import { ReplaceFunctionEnding } from "../modules/functions";
import { getLine, getChars, sliceLine } from "../modules/linesManipulation";
import { MatchAllRegex } from "../modules/regex";

let triggerMatch = VerEx()
    .find("function")
    .maybe(" ")
    .maybe(VerEx().word()) // provide default value also for anonymous functions
    .beginCapture()
        .then("(")
        .anythingBut("()")
        .then(")")
    .endCapture()

let extractTypes = VerEx()
    .find("<")
        .beginCapture()
            .anythingBut(">")
        .endCapture()
    .find(">")
    .find(" ")
    .beginCapture()
        .word()
    .endCapture()

let TypeChecking = {
    id: "typeChecking",
    from: triggerMatch,
    to: function(file) {
        let matches = MatchAllRegex(file, triggerMatch);
        let originalFile = file // originalFile is used to have a true reference of where the match was located since we are modifying the file variable
        matches.map(match => {
            // match[1] = params
            let paramsTypes = MatchAllRegex(match[1], extractTypes)

            // If have matched something
            if (paramsTypes.length > 0) {
                let afterMatch = getLine(originalFile, match.index)// We get the line from the original file to have a line matching to match.index, which was found in that file
                let params = sliceLine(file, afterMatch, afterMatch + 1) // takes only the first line (parameters line)
                let originalParams = params
                
                params = params.replace(VerEx().lineBreak().endOfLine(), "") // we remove the linebreak and then add it afterwards

                paramsTypes.map(param => {
                    // param[1] = type
                    // param[2] = name

                    // add the default value check
                    params +=
                        `;assert(type(${param[2]}) == "${param[1]}", "${param[2]}: ${param[1]} expected, got "..type(${param[2]}))`  // key = key ~= nil and value or defaultValue
                
                })

                // remove the types from the params
                let noExecutablePart = VerEx() // regex to replace only the non executable part ("<type>")
                    .find("<")
                        .anythingBut(">")
                    .find(">")
                    .maybe(" ")
                params = params.replace(noExecutablePart, "")
                
                params += "\n" // we re-add the newline character, otherwise you also get the first function content line in the control line
  
                // override params with controls and default value removed from params.
                file = file.replace(originalParams, params)
            }
        })
        
        return file
    },
}

export {TypeChecking}