import VerEx from "verbal-expressions";
import { MatchAllRegex } from "../modules/regex";

let match = VerEx()
    .find("...")
    .not(",").not(")").not("}")
    .beginCapture()
        .word()
    .endCapture()

let Unpack = {
    id: "unpack",
    from: match,
    to: function(file) {        
        MatchAllRegex(file, match).map(x => {
            let slicedFile = file.slice(x.index, x.index + 100)
            let originalFile = slicedFile

            slicedFile = slicedFile.replace(`...${x[1]}`, `table.unpack(${x[1]})`)
            file = file.replace(originalFile, slicedFile)
        });
        
        return file
    },
}

export {Unpack}