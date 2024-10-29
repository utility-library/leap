const fs = require("fs")

function canFileBePreprocessed(filePath) {
    try {
        let itsEscrowed = /^FXAP/
        let file = fs.readFileSync(filePath, "utf-8")
    
        return fs.existsSync(filePath) && 
               fs.statSync(filePath).isFile() && 
               itsEscrowed.exec(file) == null && 
               file.length > 0
    } catch (e) {
        return false
    }
}

function resourceNeedPreprocessing(res) {
    const nDependency = GetNumResourceMetadata(res, 'dependency');

    if (nDependency > 0) {
        for (let i = 0; i < nDependency; i++) {
            const dependencyName = GetResourceMetadata(res, 'dependency');

            if (dependencyName == GetCurrentResourceName()) {
                return true;
            }
        }
    }

    return false;
}

module.exports = {
    canFileBePreprocessed,
    resourceNeedPreprocessing
}