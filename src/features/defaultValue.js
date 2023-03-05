import VerEx from "verbal-expressions";
import { ReplaceFunctionEnding } from "../modules/functions";
import { getLine, getChars, sliceLine } from "../modules/linesManipulation";
import { MatchAllRegex } from "../modules/regex";

let triggerMatch = VerEx()
    .find("function")
    .maybe(" ")
    .maybe(VerEx().anythingBut(")")) // provide default value also for anonymous functions
    .beginCapture()
        .then("(")
        .anythingBut("()")
        .then(")")
    .endCapture()

let extractDefaultValues = VerEx()
    .beginCapture()
        .anythingBut(" ()")
    .endCapture()
    
    .maybe(" ")
    .then("=")
    .maybe(" ")
    
    .beginCapture()
        .anythingBut(",)")
    .endCapture()

let DefaultValue = {
    from: triggerMatch,
    to: function(file) {
        let matches = MatchAllRegex(file, triggerMatch);
            
        matches.map(match => {
            // match[1] = params
            let defaultValues = MatchAllRegex(match[1], extractDefaultValues)
            
            // If have matched something
            if (defaultValues.length > 0) {
                let afterMatch = getLine(file, match.index) + 1
                let parameters = sliceLine(file, afterMatch, afterMatch + 1) // takes only the first line (parameters line)
                let originalParameters = parameters
                
                parameters = parameters.slice(0, -2) // we remove the newline character and then add it afterwards

                defaultValues.map(param => {
                    // param[1] = name
                    // param[2] = value

                    // add the default value check
                    parameters +=
                        `;${param[1]} = ${param[1]} ~= nil and ${param[1]} or ${param[2]}`  // key = key ~= nil and value or defaultValue
                        
                    // remove the default value from the parameters
                    let regexEscaped = param[2].replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") // escape all regex special character
                    let noExecutablePart = new RegExp("\\s?=\\s?"+regexEscaped) // regex to replace only the non executable part (" = value")

                    parameters = parameters.replace(noExecutablePart, "")
                })
                
                parameters += "\n" // we re-add the newline character, otherwise you also get the first function content line in the control line
  
                // override parameters with controls and default value removed from parameters.
                file = file.replace(originalParameters, parameters)
            }
        })
        
        return file
    },
}

export {DefaultValue}