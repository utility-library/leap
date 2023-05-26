import VerEx from "verbal-expressions";

let match = VerEx()
    .find("new ")
    .beginCapture()
        .anythingBut("(")
        .then("(")
    .endCapture()

let New = {
    id: "new",
    from: match,
    to: function(file) {
        return file.replace(match, "$1")
    },
}

export {New}