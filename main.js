const { exec } = require("child_process")

const util = require("util")
const setImmediatePromise = util.promisify(setImmediate);

const {AddExclusion, RemoveExclusion} = require("./functions/vscode")
const {PreProcessor} = require("./functions/preprocessResource")

let vscodeInstalled = false
let leapBusy = {
    status: false,
    resource: ""
}
let lastBuild = {}
let buildQueue = {}

exec("code --version", 
    function (error, stdout, stderr) {
        if (stdout) { // if we dont get an error (unrecognized command etc.)
            vscodeInstalled = true
        }
    }
)

async function mainLoop() {
    while (true) {
        for (let resource in buildQueue) {
            const start = Date.now()
            await setImmediatePromise()

            let cb = buildQueue[resource]
            // Add vscode exclusion
            let resourcePath = GetResourcePath(resource)
            let preprocessor = new PreProcessor(resource)
            preprocessor.createTempBackup()
    
            if (vscodeInstalled) {
                AddExclusion(resourcePath)
            }
    
            // Preprocess (Shadow writing)
            try {
                await preprocessor.run()
                await preprocessor.write()
        
                preprocessor.writeOriginal()
                cb(true)
            } catch(error) {
                cb(false, "^1" + error.message + "^0")
            }
            
            // Remove vscode exclusion
            if (vscodeInstalled) {
                RemoveExclusion(resourcePath)
            }

            await new Promise(resolve => setTimeout(resolve, 100))
        }

        await new Promise(resolve => setTimeout(resolve, 100))
    }
};

setImmediate(function () {
    mainLoop()
})

// Register the build task
let leapBuildTask = {
    shouldBuild(res) {
        if (lastBuild[res]) {
            //console.log((Date.now() - lastBuild[res]))
            if ((Date.now() - lastBuild[res]) < 50) { // prevent build loop
                return false
            }
        }

        // Check if the resource has dependency
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
    },
    build(res, cb) {
        // We need to use this trick as the build function cant be directly async
        let buildleap = async () => {
            // Handle leap busy
            if (leapBusy.status) {
                console.log(`leap is busy: we are preprocessing ${leapBusy.resource}`)
            }

            await (new Promise(resolve => {
                buildQueue[res] = (status, err) => {
                    lastBuild[res] = Date.now()

                    if (status) {
                        cb(true)
                    } else {
                        cb(false, err)
                    }

                    delete buildQueue[res]
                    resolve()
                }
            }))

            /*
            // Set leap busy
            leapBusy.status = true
            leapBusy.resource = res

            // Add vscode exclusion
            let resourcePath = GetResourcePath(res)
            let preprocessor = new PreProcessor(res)
            preprocessor.createTempBackup()

            if (vscodeInstalled) {
                AddExclusion(resourcePath)
            }

            // Preprocess (Shadow writing)
            try {
                await preprocessor.run()
                await preprocessor.write()

                lastBuild[res] = Date.now()

                preprocessor.writeOriginal()
                cb(true)
            } catch(error) {
                cb(false, "^1" + error.message + "^0")
            }
            
            // Remove vscode exclusion
            if (vscodeInstalled) {
                RemoveExclusion(resourcePath)
            }

            // Reset leap busy
            leapBusy.status = false
            leapBusy.resource = undefined
            */
        }

        buildleap().then()
    }
}
RegisterResourceBuildTaskFactory("leap", () => leapBuildTask)

// Register the command
RegisterCommand("leap", async (source, args) => {
    if (source != 0) return // only server side can use the command

    let [type, resourceName] = args

    // No type or resource provided, display help
    if (!type || !resourceName) {
        console.log(`leap restart <resource>`)
        console.log(`leap build <resource>`)
        return
    }

    let preprocessor = new PreProcessor(resourceName)
    preprocessor.createTempBackup()

    await preprocessor.run(type)

    switch(type) {
        case "build": {
            await preprocessor.write("build")
                console.log(`^2Builded ${resourceName} successfully^0`)
            break;
        }
        case "restart": {
            StopResource(resourceName)

            await preprocessor.write()

            lastBuild[resourceName] = Date.now()
            StartResource(resourceName)

            preprocessor.writeOriginal()
            break;
        }
    }

}, true)