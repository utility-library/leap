import luaparse from "../features/leapparse.js"
import luamin from "luamin";

let hooks = []

function AddHook(id, content) { // id can be an array with multiple valid id
    if (!hooks[id]) {
        hooks[id] = []
    }

    var _content = luamin.minify(content)
    var _ast = luaparse.parse(_content, {locations: true, luaVersion: "5.4"})

    hooks[id].push(_ast)
}

function GetHooks() {
    return hooks
}

export {AddHook, GetHooks}