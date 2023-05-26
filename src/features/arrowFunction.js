import VerEx from "verbal-expressions";
import { ReplaceFunctionEnding } from "../modules/functions";
import { getLine } from "../modules/linesManipulation";
import { MatchAllRegex } from "../modules/regex";

let match = VerEx()
    // with brackets
    .maybe(VerEx()
        .find("(")
        .beginCapture()
            .anythingBut("()")
        .endCapture()
        .then(")")
    )
    // without brackets
    .maybe(VerEx()
        .beginCapture()
            .word()
        .endCapture()
    )

    .maybe(" ")
    .then("=>")
    .maybe(" ")
    .then("{")

let ArrowFunction = {
    id: "arrowFunction",
    from: match,
    to: function(originalFile) {
        let file = originalFile
        let matches = MatchAllRegex(file, match);
        // replace all closing tags from "}" to "end"
        matches.map(x => {
            [file] = ReplaceFunctionEnding(file,file.split("\n").slice(getLine(originalFile, x.index)).join("\n"))

            match.removeModifier("g") // we want to replace it once, so later, if necessary, we can replace the one without parentheses with the correct capture group

            if (x[1] != null) { // match with the brackets
                // replace the opening tag from "(params) => {" to "function(params)"                
                file = file.replace(match, "function($1)") 
            } else if (x[2] != null) { // match without the brackets                
                // replace the opening tag from "param => {" to "function(param)"
                file = file.replace(match, "function($2)")
            }

            match.addModifier("g") // we re-add the flag for upcoming matches
        })

        //console.log(matches)
    
        return file
    },
}

export {ArrowFunction}