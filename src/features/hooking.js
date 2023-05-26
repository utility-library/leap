let hooks = []

function AddHook(id, content) { // id can be an array with multiple valid id
    hooks.push({id: id, content: content+";"})
}

function HookFunctionsOfMatched(body, matchedFeatures) {
    for (let matched of matchedFeatures) {
        for (let hook of hooks) {
            // Check if we need to skip the hook creation
            if (typeof hook.id == "string") {
                if (hook.id != matched) {
                    continue
                }
            } else {
                let found = hook.id.some( id => {
                    if (id == matched) return true
                })

                if (found) {
                    continue
                }
            }

            body = hook.content + body 
        }
    }

    return body
}

export {AddHook, HookFunctionsOfMatched}