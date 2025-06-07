<h1 align="center">Leap V3</h1>

`Leap` (**L**ua **e**xtension **a**ccessibility **p**re-processor) is a fast pre-processor of a "modernized" and extended version of lua that pre-processes in pure executable lua.  
Think of it as an effective "modernity" leap into the future to make lua a feature-rich language.  

Leap is inspired by the functionality and syntax found in [JS](https://www.javascript.com) and is primarily intended for [**FiveM**](https://fivem.net), this however does not deny the possibility of extension to wider horizons.

To assist with debugging and error reporting, Leap retains the original line numbers from the code.

Leap features a caching system that processes only the files that have been modified, ensuring that the resource is only preprocessed when necessary; if no changes are detected, the resource will simply restart.
You can find the files created by this system under the `cache` folder in the root folder of your server (near the `resources` folder)

After preprocessing, Leap automatically adds the `build` subfolder (if needed) to all file declarations in the `fxmanifest.lua` under the `client`, `server`, `shared`, and `escrow_ignore` sections.
Since it will modify the `fxmanifest.lua` it requires the permission to run the `refresh` command, you can allow this by adding `add_ace resource.leap command.refresh allow` in your `server.cfg`

> The [vscode syntax highlight extension is available!](https://marketplace.visualstudio.com/items?itemName=XenoS.leap-lua).

> **Note** To contribute to the grammar and/or preprocessor in general please visit the `preprocessor` branch.

## Usage
To use Leap, simply download it and start it as you would with any normal resource. You'll need to add Leap to your resource's dependencies, after which you can access any of its features. When the resource starts, Leap will handle the preprocessing of the necessary files automatically.

Example:
`your_resource_that_use_leap > fxmanifest.lua`:
```lua
fx_version "cerulean"
game "gta5"

server_script "server.lua"

dependency "leap" -- This is necessary to have the resource automatically preprocessed
```

You can also manually use the `leap restart your_resource_that_use_leap` command to preprocess the files and restart the resource.

### Escrow
To use Leap in the escrow or outside the Leap ecosystem, you can create a standalone version by running the command [leap build](#leap-build)

## Commands
**TIP**: these commands can also be used in the cfg after the leap startup.

### leap restart
`leap restart <resource>` build and restarts the resource, manual version of the more classic `restart <resource>`

---

### leap build
`leap build <resource>` pre-processes the resource by creating a subfolder named `build` that contains the pre-processed version of the resource (This will ignore the cache)

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

## Leap Library

### leap.deserialize
Converts serialized class back into an instance of a specific class, restoring the object's structure and data  
All sub objects will also be deserialized recursively

Example:
```lua
RegisterNetEvent("myEvent", function(myObject)
    local obj = leap.deserialize(myObject)
    print(obj.myVar)
end)
```

Classes can expose the `deserialize` method to achieve custom serialization.  
Example:
```lua
class MyClass {
    myVar = vec3(1, 2, 3),

    deserialize = function(data)
        self.myVar = vector3(data.myVar[1], data.myVar[2], data.myVar[3]) -- Restore the vec3 from the array
    end
}
```

### leap.serialize
Converts an object or an array of objects (typically an instance of a class) into a serializable table format.  
All sub objects will also be serialized recursively

Example:
```lua
local myObject = MyClass:new()
myObject.myVar = "Hello"

local serialized = leap.serialize(myObject) -- {myVar = "Hello"}
TriggerServerEvent("myEvent", serialized)
```

Classes can expose the `serialize` method to achieve custom serialization.  
Example:
```lua
class MyClass {
    myVar = vec3(1, 2, 3),

    serialize = function()
        return {
            myVar = {math.round(self.myVar.x, 3), math.round(self.myVar.y, 3), math.round(self.myVar.z, 3)}, -- Save a vec3 to an array with rounded values
        }
    end
}
```

The `skipSerialize` decorator can be used to prevent certain fields from being serialized.

```lua
@skipSerialize({"transient"})
class MyClass {
    myVar = vec3(1, 2, 3),
    transient = false,
}

local obj = new MyClass()
-- Need to change values to trigger serialization
obj.myVar = vector3(2, 3, 4)
obj.transient = true

local serialized = leap.serialize(obj) -- {"__type":"MyClass","myVar":{"x":2.0,"y":3.0,"z":4.0}}
```

### leap.fsignature
Retrieves the function signature metadata of a given function, such as argument names and return status.  

> **Note** Useful for debugging, documentation generation, or developer tooling that needs to understand a function's structure.  

**Signature format example:**
```lua
{
    args = {
        { name = "a" },
        { name = "b" },
    },
    name = "myFunction",
    has_return = true,
}
```

> **Note** `has_return = true` doesn't guarantee that the function *always* returns a value, it simply indicates that a `return` statement **with a value** was detected somewhere in the function body.

Example:
```lua
local function addNumbers(numA, numB)
    return numA + numB
end

local signature = leap.fsignature(addNumbers)

if signature then
    print("Function name:", signature.name)
    print("Has return:", signature.has_return)
    
    print("Arguments:")
    for i, arg in ipairs(signature.args) do
        print(i.." = "..arg.name)
    end
else
    print("No signature metadata found.")
end

-- OUTPUT:

-- Function name: addNumbers
-- Has return: true
-- Arguments:
-- 1 = numA
-- 2 = numB
```

### type (override)
Overrides Lua's native `type` behavior.
When `type(obj)` is called on an object created from a class, it will return the class name instead of `"table"`.

> **Note** This checks and return the `__type` field inside the "table", classes are just tables with metatable

```lua
local myDog = new Dog()
print(type(myDog)) -- Output: "Dog"
```

## Features

### Classes
Classes are a model for creating objects (a particular data structure), providing initial values for state (member variables or attributes), and implementing behavior (member functions or methods).  
It is possible as well to extend already existing classes, each method of the class that extends the other class will have a variable named `super` which is an instantiated object of the original class, calling this variable as a function will call the constructor of the original class, otherwise the data of the original class can be accessed.  
Constructor parameters are those passed when a new object is instantiated. [Read more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)  
> **Note** Classes have their own type, so calling `type(obj)` with an instantiated class will return the class name
> **Note** You can edit the class prototype after the definition using the `__prototype` attribute 
---

Syntax:  
> **Note** Methods automatically hold the `self` variable referring to the instantiated object
```lua
class className {
    var1 = 1,
    constructor = function()
        print(self.var1)
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
        self.super()
        
        -- right now they should printout the same value, since they have not been touched
        print(self.super.someVariable)
        print(self.someVariable)
    end
}

new AdvancedClass()
-- output:
--[[
    instantiated advanced class
    instantiated base class
    100
    100
]]
```

### Compact function
An compact function expression is a compact alternative to a traditional function expression.
Is simply an alternative to writing anonymous functions, similar to [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

Syntaxes:
```lua
(param1, paramN) do
  -- code
end
```
```lua
param do -- code (single expresion)
```
```lua
(param1, paramN) do -- code (single expresion)
```

Example:
```lua
local tab = {3, 10, 50, 20, 5}

-- Inline with multiple params
table.sort(tab, (a, b) do a < b)

 -- Inline with single param
AddEventHandler('onResourceStart', name do print("Resource ${name} started!"))

 -- Multiline with multiple params
AddEventHandler('playerConnecting', (name, setKickReason, deferrals) do
    if name == "XenoS" then
        print("XenoS is connecting! WOW!")
    else
        print("Player ${name} is connecting!")
    end
end)
```

### Continue keyword
Used to continue execution in a loop. It is useful when you want to skip the current iteration of a loop.

Example:
```lua
for i = 1, 10 do
    if i == 5 then
        continue
    end
    print(i)
end

-- output:
-- 1
-- 2
-- 3
-- 4

-- 6
-- 7
-- 8
-- 9
-- 10
```

### Cosmetic underscores for integers
Are used to improve readability in large numeric literals by grouping digits without affecting the value. They allow you to visually separate groups, like thousands or millions, making long numbers easier to parse at a glance. The underscores are ignored during preprocessing.

Syntax:  
```lua
1_000_000
```

Example:
```lua
local myBigNumber = 2_147_483_647
```

### Decorators
By definition, a decorator is a function that takes another function and extends the behavior of the latter function without explicitly modifying it.
Its like [wrappers](https://en.wikipedia.org/wiki/Wrapper_function)
You can also pass parameters to the decorators.

[Read more here](https://realpython.com/primer-on-python-decorators/#simple-decorators)

Syntax:  
```lua
function decoratorName(func, a, b)
    return function(c, d)
        func(c,d)
    end
end

@decoratorName(a, b)
function fnName(c, d)
    -- code
end
```

Example:
```lua
function stopwatch(func)
    return function(...)
        local time = GetGameTimer()
        local data = func(...)
        print("taken "..(GetGameTimer() - time).."ms to execute")
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

```lua
function netevent(self, func, name)
    RegisterNetEvent(name)
    AddEventHandler(name, function(...)
        func(self, ...) -- Remember to call the function with the class instance!
    end)

    return func
end

class Events {
    @netevent("Utility:MyEvent") -- Decorators can also be used in classes fields (will pass self instance)
    eventHandler = function()
        print("Event triggered!")
    end
}
```

```lua
function callInit(class)
    class:init()
    return class
end

@callInit -- Decorators can also be used in classes fields like functions
class MyClass {
    init = function()
        print("Class initialized!")
    end
}
```

### Default value
Default function parameters allow named parameters to be initialized with default values if no value or nil is passed.

Syntax:  
```lua
function fnName(param1 = defaultValue1, ..., paramN = defaultValueN) {
  -- code
}
```

Example:
```lua
function multiply(a, b = 1)
  return a * b
end

print(multiply(5, 2))
-- Expected output: 10

print(multiply(5))
-- Expected output: 5
```

### Filter
A filter is a mechanism for validating specific conditions before a function is executed. It serves as a precondition gatekeeper, ensuring the function runs only if all criteria are satisfied. If any condition fails, the filter stops execution and returns an error message.  
Filters simplify code by centralizing validation logic and making it reusable across multiple functions.  
They can access local variables from their enclosing scope and are evaluated with the [`using`](#using-operator) operator.

Syntax:  
```lua
filter Name(param1, param2, ...)
    condition1 else "Error message for condition1!",
    condition2
end

filter Name
    condition1 else "Error message for condition1!",
    ...
end
```

Example:
```lua
filter IsAuthorized(action)
    user.role == "admin" else "User is not an admin!",
    user.permissions[action] else "User lacks permission to perform ${action}!",
end

-- Check "using" for a usage example
```

### In operator
Checks whether a specified substring/element exists in an string/table. It returns true if the substring/element is found and false otherwise.

In **arrays** checks if **value** is in table.
In **hash maps** checks if the **key** is in table.
For **mixed tables**, it checks if the **value** is in the table, or if the **key** is in the table.

In **strings** checks if **substring** is in string.

Syntax:
```lua
value in table
key in table
substring in string
```

Example:
```lua
local array = {3, 10, 50, 20, 5}

if 10 in array then
    print("found 10")
end
----
local hashmap = {
    ["key1"] = "value1",
    ["key2"] = "value2",
    ["key3"] = "value3"
}

if "key1" in hashmap then
    print("found key1")
end
----
local mixed = {
    ["key1"] = "value1",
    3,
    10,
    20
}

if 10 in mixed or "key1" in mixed then
    print("found 10 or key1")
end
----
local string = "Hello World"

if "World" in string then
    print("found World")
end
```

### Is operator
The is operator checks whether an object is an instance of a specific class or one of its subclasses. It is a type-checking operator that supports inheritance-aware comparisons.

Example:
```lua
class Animal {}
class Dog extends Animal {}

local a = Animal()
local d = Dog()

print(d is Dog)    -- true  (exact class)
print(d is Animal) -- true  (subclass of Animal)
print(a is Dog)    -- false (not an instance of Dog or its subclasses)
```

### Keyword Arguments
Keyword arguments allow calling functions with named parameters, improving readability and flexibility. They also allow parameters to be passed in any order.

Syntax:
```lua
functionName(param1 = value1, param2 = value2, ...)
```

Example:
```lua
function greet(name, age)
    print("Hello " .. name .. ", Age: " .. age)
end

greet(name = "John", 20)
greet(age = 21, name = "Anna")
greet("Will", 34)
```

### New
The new operator is used to create an instance of an object.
During preprocessing it is skipped.
Its utility is to make it clear in the code when you are instantiating an object or calling a function

Syntax:  
```lua
new Class()
```

Example:
```lua
class BaseClass {
    someVariable = 100,
    constructor = function()
        print("instantiated base class")
    end
}

local base = new BaseClass()
```

### Not equal (!=)
An alias of the not equal operator (~=) 

Syntax:  
```lua
if true != false then
    -- code
end
```

Example:
```lua
local a = 10
local b = 20

if a != b then
    print("not equal")
end
```

### Not in operator
Inverse of the in operator.

Syntax:
```lua
value not in table
key not in table
substring not in string
```

### String Interpolation
allows to embed expressions within a string, making it easy to insert variable values or expressions directly into a string. Using ${expression} you can dynamically include content without needing to concatenate strings manually.

Syntax:
```lua
"... ${expression} ..."
'...${expression}...'
```

Example:
```lua
local example1 = "100+200 = ${100+200}" -- 100+200 = 300
local example2 = "100+200 = ${addNumbers(100, 200)}" -- 100+200 = 300 (using an hypothetical function)
```

### Table comprehension
Is a concise syntax for creating and transforming tables in a single expression, typically by applying conditions or transformations to elements within a specified range. It allows for easy filtering, mapping, or generating values based on criteria, reducing the need for longer loops or conditional structures.

Syntax:  
```lua
{expression for items in iterable if condition}
```

Example:
```lua
-- Create a new table with every element multiplied by 2
local mult2 = {v*2 for k, v in pairs(tab)}

-- Create a new table with every element multiplied by 2 if it is greater than 2
local mult2IfGreaterThan2 = {v*2 for k, v in pairs(tab) if v > 2}

-- Create a new table with every element multiplied by 2 if it is greater than 2 and less than 50
local mult2IfGreaterThan2AndLessThan50 = {v*2 for k, v in pairs(tab) if v > 2 and v < 50}

-- Create a new table with every element as "element:k"
local keyAsElement = {"element:${k}", v for k, v in pairs(tab)}
```

### Ternary operator
The ternary operator is a shorthand for conditional expressions, allowing for a quick inline if-else statement, return one of two values based on whether the condition is true or false.

Syntax:  
```lua
condition ? value1 : value2
```

Example:
```lua
local result = 10
local isResultGreaterThan2 = result > 2 ? "Yes" : "No"
```

### Throw
Used to create custom exceptions in code, by using `throw`, you can specify an error as any value (generally a string or an object) that provides information about the issue, which can then be caught and handled by a try-catch block.
the try-catch block can also return a value. 

Custom errors need to extend the `Error` class and can provide a `toString` to return a fully custom error message, by default the error message will be `<type>: <self.message>`

Example:
```lua
try
    throw "Something went wrong"
catch e then
    print("Error: "..e)
end
```

```lua
class CustomError extends Error {
    constructor = function(importantInfo)
        self.info = importantInfo
    end
}

try 
    throw new CustomError("Some important info here")
catch e then
    if type(e) == "CustomError" then
        print(e.info)
    end
end
```

```lua
class AnotherTypeOfError extends Error {}

throw new AnotherTypeOfError("This is the message")
-- AnotherTypeOfError: This is the message
```

```lua
class CustomError2 extends Error {
    toString = function()
        print("Custom message: "..self.message)
    end
}

throw new CustomError2("Some important info here")
-- Custom message: Some important info here
```

### Try-catch
Used for error handling, The `try` block contains code that may throw an error, while the `catch` block handles the error if one occurs, preventing the script from crashing and allowing for graceful error recovery.

Syntax:  
```lua
try 
    -- code
catch errorVariable then
    -- code
end
```

Example:
```lua
try
    indexingTableThatDoesntExist[100] = true
catch e then
    print("Error: "..e)
end
```

### Type checking
Type checking is the process of verifying data types at runtime to prevent errors and ensure compatibility. It ensures that parameters are used with compatible types. This runtime checking helps catch type errors that could lead to unexpected behavior.
> **Note** [Classes](#classes) can also be used as types

Syntax:  
```lua
function funcName(param1: type1, ..., paramN: typeN)
    -- code
end
```

Example:  
```lua
function DebugText(text: string)
    print("debug: "..text)
end


DebugText("test") -- debug: test
DebugText(100) -- Error loading script *.lua in resource ****: @****/*.lua:7: text: string expected, got number
```
```lua
class Example {
    myVar = true
}

function FunctionThatAcceptOnlyExampleClass(<Example> example)
    print("You passed the right variable!")
end

FunctionThatAcceptOnlyExampleClass("Test") -- Error since string is not of type Example
```

### Using operator
The `using` operator runs a [filter](#filter), validating the conditions defined within it. If any of the conditions fail, it throws an error, preventing the execution of the associated code.
although they are almost always used in functions nothing prohibits you from being able to use them where you want to

Syntax:
```lua
using Filter(param1, param2, ...)

using Filter
```

Example:
```lua
function deletePost(user: User) using IsAuthorized("deletePost") -- Check "filter" to see the filter code
    print("Post deleted successfully!")
end

-- This is also valid!
function deletePost(user: User) 
    using IsAuthorized("deletePost")
    print("Post deleted successfully!")
end
```

## [Convars](https://docs.fivem.net/docs/scripting-reference/convars/)

| Convar       | Default | Type    |
|--------------|---------|---------|
| leap_verbose | false   | boolean |