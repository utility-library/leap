function GetAllResourceMetadata(resourceName, key) {
    let metadataNum = GetNumResourceMetadata(resourceName, key)
    let result = []

    for (let i=0; i < metadataNum; i++) {     
        let metadata = GetResourceMetadata(resourceName, key, i)
        
        if (!metadata.includes("--") && metadata.includes(".lua")) {
            result.push(metadata)
        }
    }

    return result
}

export {GetAllResourceMetadata}