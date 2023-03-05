String.prototype.occurrences = function(string) {
    let regex = new RegExp(string, "g")

    return (this.match(regex) || []).length
}