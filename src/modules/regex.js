function MatchAllRegex(string, pattern) {
    return Array.from(string.matchAll(pattern))
}

function MatchRegex(pattern, text) {
    let regex = new RegExp(pattern)

    return regex.exec(text)
}

export {MatchRegex, MatchAllRegex}