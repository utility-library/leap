import fs from "fs"
let vscodeSettingsAlreadyExist = {}

function SetWatcherExclude(file, status) {
    let rawdata = fs.readFileSync(file);
    let settings = JSON.parse(rawdata);

    if (!settings["files.watcherExclude"]) {
        settings["files.watcherExclude"] = {}
    }

    settings["files.watcherExclude"]["**/*.lua"] = status


    let data = JSON.stringify(settings, null, 4);
    fs.writeFileSync(file, data);
}

function AddExclusion(resourcePath) {
    if (fs.existsSync(resourcePath+"/.vscode/")) {
        SetWatcherExclude(resourcePath+"/.vscode/settings.json", true)
        vscodeSettingsAlreadyExist[resourcePath] = true
    } else {
        fs.mkdirSync(resourcePath+"/.vscode")
        fs.writeFileSync(resourcePath+"/.vscode/settings.json", JSON.stringify({
            "files.watcherExclude": {
                "**/*.lua": true
            }
        }))
    }
}

function RemoveExclusion(resourcePath) {
    if (vscodeSettingsAlreadyExist[resourcePath]) {
        SetWatcherExclude(resourcePath+"/.vscode/settings.json", false)
        delete vscodeSettingsAlreadyExist[resourcePath]
    } else {
        fs.rmSync(resourcePath+"/.vscode", {recursive: true, force: true})
    }
}

export {AddExclusion, RemoveExclusion}