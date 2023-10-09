class Dio {
    value = "dio",

    destructor = function()
        print("destructor", self.value)
    end
}

class Test extends Dio {
    value = "test",

    constructor = function(param <string>)
        print("constructor", self.value)
        print("param", param)
    end,

    destructor = function()
        print("destructor", self.value)
    end
}

local test = new Test("test")