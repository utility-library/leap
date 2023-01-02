function GetAllResourceMetadata(resourceName, key) {
    let metadataNum = GetNumResourceMetadata(resourceName, key)
    let result = []

    for (let i=0; i < metadataNum; i++) {        
        result.push(GetResourceMetadata(resourceName, key, i))
    }

    return result
}

export {GetAllResourceMetadata}