import { CreateCommand, Command } from "./modules/command"
import { performance } from 'perf_hooks'
import { exec } from "child_process"

//#region Features
import { ArrowFunction } from "./features/arrowFunction"
import { NotEqual } from './features/notEqual'
import { Class, ClassExtends } from './features/classes'
import { DefaultValue } from './features/defaultValue'
import { Unpack } from './features/unpack'
import { New } from './features/new'
import { Decorators } from './features/decorators'
import { TypeChecking } from "./features/typeChecking"
//#endregion

// Functions are called only once per file, so you need to use the regex module to find all matches
let Features = [
    ArrowFunction,
    NotEqual,
    Class,
    ClassExtends,
    DefaultValue,
    TypeChecking,
    Unpack,
    New,
    Decorators
]

let lastBuild = {}
let vscodeInstalled = false

exec("code --version", 
    function (error, stdout, stderr) {
        if (stdout) { // if we dont get an error (unrecognized command etc.)
            vscodeInstalled = true
        }
    }
)

function UpdateLastBuildTimeForResource(resourceName) {
    lastBuild[resourceName] = performance.now()
}

if (GetCurrentResourceName() == "leap") {
    CreateCommand("leap")

    let leapBuildTask = {
        shouldBuild(res) {
            if (lastBuild[res]) {
                console.log((performance.now() - lastBuild[res]))
                if ((performance.now() - lastBuild[res]) < 250) { // prevent build loop
                    return false
                }
            }

            const nDependency = GetNumResourceMetadata(res, 'dependency');
    
            if (nDependency > 0) {
                for (let i = 0; i < nDependency; i++) {
                    const dependencyName = GetResourceMetadata(res, 'dependency');
    
                    if (dependencyName == "leap") {
                        lastBuild[res] = performance.now()
                        return true;
                    }
                }
            }
    
            return false;
        },
        async build(res, cb) {
            let [status, error] = await Command(0, ["restart", res, true])
            lastBuild[res] = performance.now()

            if (error) {
                cb(status, error)
            } else {
                cb(status)
            }
        }
    }
    
    RegisterResourceBuildTaskFactory("leap", () => leapBuildTask)    
} else {
    setInterval(() => console.log("^1PLEASE DON'T RENAME THE RESOURCE"), 100)
}

export {Features, vscodeInstalled, UpdateLastBuildTimeForResource}