import { CreateCommand } from "./modules/command"

//#region Features
import { ArrowFunction } from "./features/arrowFunction"
import { NotEqual } from './features/notEqual'
import { Class, ClassExtends } from './features/classes'
import { DefaultValue } from './features/defaultValue'
import { Unpack } from './features/unpack'
import { New } from './features/new'
import { Decorators } from './features/decorators'
//#endregion

let Features = [
    ArrowFunction,
    NotEqual,
    Class,
    ClassExtends,
    DefaultValue,
    Unpack,
    New,
    Decorators
]

CreateCommand("parser")

export {Features}