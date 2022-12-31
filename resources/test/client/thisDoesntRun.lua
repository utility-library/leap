print("Some print")

local imOnlyAVariable = "A variable"

function SomeFunction(cb)
    cb("This is a callback")
end

local imAnArrowFunction = (parameter1, parameter2, parameter3) => {
    print("Im printing from an arrow function")

    local ImATableInAnArrowFunction = {
        key1 = "value",
        key2 = 1,
        key3 = false,
        key4 = {
            key = "value"
        },
    }


    SomeFunction((text) => {
        print("Text from SomeFunction "..text)
    })
}