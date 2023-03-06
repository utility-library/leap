<h1 align="center">Leap</h1>

`Leap` (**L**ua **e**xtension **a**ccessibility **p**re-processor) is a fast pre-processor of a "modernized" and extended version of lua that pre-processes in pure executable lua.  
Think of it as an effective "modernity" leap into the future to make lua a feature-rich language.  

Leap is inspired by the functionality and syntax found in [JS](https://www.javascript.com) and is primarily intended for [**FiveM**](https://fivem.net), this however does not deny the possibility of extension to wider horizons.

### Shadow writing

Leap uses a **shadow writing** system (*we called it that*) that works in the following way:
After preprocessing the files, [**FiveM**](https://fivem.net) will read the files, cache them and start the resource with those cached files as soon as we start the resource, we instantly rewrite the old files so that it looks like nothing happened. This will be done in very few ms (5/10), so from [VSC](https://code.visualstudio.com) or any other IDE that has the auto refresh feature when updating a file it will look like it was never overwritten

<div align="center">
 <img src="https://user-images.githubusercontent.com/55803068/223179277-45c58f41-6a65-4e42-a18e-a5aa786155e0.png"  width="60%" height="60%">
</div>

## Commands
### parser restart
`parser restart <resource>` restarts the resource by preprocessing it before restarting it using *shadow writing*, this command is quite useful when creating a resource, since you don't have to rebuild it every time and restart the resource but it's like everything in one command.

**TIP**: these commands can also be used in the cfg after the Leap startup.

---

### parser build
`parser build <resource>` pre-processes the resource by creating a subfolder named `build` that contains the pre-processed version of the resource

resource structure tree after build:
```
│   fxmanifest.lua
│
├───build
│   └───server
│           main.lua
│
└───server
        main.lua
```

---

### parser rebuild
> **Warning** Command designed only for development

`parser rebuild` rebuild with esbuild directly from fxserver instead of having to open a separate process (simply run `npm run build`)

## Features

### Arrow function
An arrow function expression is a compact alternative to a traditional function expression.
Is simply an alternative to writing anonymous functions

[Read more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

Syntaxes:
```lua
(param1, paramN) => {
  statements
}
```
```lua
param => {
  statements
}
```

Example:
```lua
Citizen.CreateThread(() => {
    print("test")
})

AddEventHandler("eventName", (text) => {
    print(('I just received %s'):format(text))
})
```

---

### Classes
Classes are a model for creating objects (a particular data structure), providing initial values for state (member variables or attributes), and implementing behavior (member functions or methods).  
It is possible as well to extend already existing classes, each method of the class that extends the other class will have as a base a variable named `super` which is an instantiated object of the original class, calling this variable as a function will call the constructor of the original class, otherwise the data of the original class can be accessed.  
Constructor parameters are those passed when a new object is instantiated.

[Read more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

Syntaxes:  
> **Note** Methods automatically hold the `self` variable referring to the instantiated object
```lua
class BaseClass {
    someVariable = 100,
    constructor = function()
        print("instantiated base class")
        print(self.someVariable)
    end
}
```
```lua
class AdvancedClass extends BaseClass {
    constructor = function()
        print("instantiated advanced class")
    end
}
```

Example:
```lua
class BaseClass {
    someVariable = 100,
    constructor = function()
        print("instantiated base class")
    end
}

class AdvancedClass extends BaseClass {
    constructor = function()
        print("instantiated advanced class")
        super()
        
        -- right now they should printout the same value, since they have not been touched
        print(super.someVariable)
        print(self.someVariable)
    end
}

AdvancedClass()
-- output:
--[[
    instantiated advanced class
    instantiated base class
    100
    100
]]
```

### Decorators
By definition, a decorator is a function that takes another function and extends the behavior of the latter function without explicitly modifying it.
Its like [wrappers](https://en.wikipedia.org/wiki/Wrapper_function)
You can also pass parameters to the decorators.

[Read more here](https://realpython.com/primer-on-python-decorators/#simple-decorators)

Syntaxes:  
```lua
function exampleDecorator(func)
    return function(...)
        func(...)
        print("test2")
    end
end

@exampleDecorator
function example()
    print("test")
end
```

```lua
function exampleDecorator(func, canDoSomething)
    return function(...)
        func(...)
        print("test2")
        print("can do something?", tostring(canDoSomething))
    end
end

@exampleDecorator(true)
function example()
    print("test")
end
```
Example:
```lua
function stopwatch(func)
    return function(...)
        local time = GetGameTimer()
        local data = func(...)
        print(func.name.." taken "..(GetGameTimer() - time).."ms to execute")
        return data
    end
end

@stopwatch
function someMathIntensiveFunction(a, b, pow)
    for i=1, 500000 do
        math.pow(a*b, pow)
    end

    return math.pow(a*b, pow)
end

someMathIntensiveFunction(10, 50, 100)
-- output: 
--[[
    someMathIntensiveFunction taken 2ms to execute
]]
```
