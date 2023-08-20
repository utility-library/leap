function GetAllResourceMetadata(resourceName, key, type) {
    let metadataNum = GetNumResourceMetadata(resourceName, key)
    let result = []

    for (let i=0; i < metadataNum; i++) {     
        let metadata = GetResourceMetadata(resourceName, key, i)
 
        if (!metadata.includes("--") && (metadata.includes(".lua") || metadata.includes(".*"))) {
            if (type == "build") {
                if (metadata.includes("@")) {
                    continue
                }
            }

            result.push(metadata)
        }
    }

    return result
}

export {GetAllResourceMetadata}