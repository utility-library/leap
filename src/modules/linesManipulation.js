function getLine(fileData, string) {    
    if (typeof string == "string") {
        let char = fileData.indexOf(string)
        fileData = fileData.substring(0, char)
        let match = fileData.match(/\n/gi)
    
        if (match) {
            return match.length + 1
        } else {
            return 1
        }
    } else {
        let sliced = fileData.substr(0, string)
        let match = sliced.match(/\n/gi)

        if (match) {
            return match.length + 1
        } else {
            return 1
        }
    }
}

function getChars(fileData, lineNumber) {
    let lines = fileData.split("\n")
    let chars = 0
    
    if (lineNumber > lines.length) return -1
    
    for (i=0; i < lineNumber-1; i++) {
        chars = chars + lines[i].length + 1 // the \n char that we have splitted
    }

    return chars
}

function sliceLine(string, lineStart, lineEnd) {
    if (lineStart && !lineEnd) {
        let chars = getChars(string, lineStart)

        return string.slice(chars)
    } else {
        let charsStart = getChars(string, lineStart)
        let charsEnd = getChars(string, lineEnd)

        return string.slice(charsStart, charsEnd)
    }
}

export {getLine, getChars, sliceLine}