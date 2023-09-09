import { CreateCommand, Command } from "./modules/command"
import { AddExclusion, RemoveExclusion } from './modules/vscode'

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

let leapBusy = {
    status: false,
    resource: ""
}
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (GetCurrentResourceName() == "leap") {
    CreateCommand("leap")

    let leapBuildTask = {
        shouldBuild(res) {
            if (lastBuild[res]) {
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
        build(res, cb) {
            let buildleap = async () => {
                //await CheckEverythingStarted();
                if (leapBusy.status) {
                    console.log(`leap is busy: we are preprocessing ${leapBusy.resource}`)
                }

                while (leapBusy.status) {
                    await sleep(200)
                }

                leapBusy.status = true
                leapBusy.resource = res

                let resourcePath = GetResourcePath(res)

                if (vscodeInstalled) {
                    AddExclusion(resourcePath)
                }

                let [status, error] = await Command(0, ["restart", res, true])
                lastBuild[res] = performance.now()

                if (vscodeInstalled) {
                    RemoveExclusion(resourcePath)
                }

                if (error) {
                    cb(status, error)
                } else {
                    cb(status)
                }

                leapBusy.status = false
                leapBusy.resource = undefined
            }
            buildleap().then()
        }
    }
    
    RegisterResourceBuildTaskFactory("leap", () => leapBuildTask)    
} else {
    setInterval(() => console.log("^1PLEASE DON'T RENAME THE RESOURCE"), 100)
}

export {Features, vscodeInstalled, UpdateLastBuildTimeForResource}