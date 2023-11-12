<h1 align="center">Leap</h1>

`Leap` (**L**ua **e**xtension **a**ccessibility **p**re-processor) is a fast pre-processor of a "modernized" and extended version of lua that pre-processes in pure executable lua.  
Think of it as an effective "modernity" leap into the future to make lua a feature-rich language.  

# V2 Status
## TODO
  - [ ] Distribuite leap as a npm for pre processing files (??)
  - [ ] Adding exports for preprocessing from another resource inside FiveM
  - [ ] Implementing shadow writing and auto resource parsing 

## Parsing suppport
  - [x] Leap parser (based on https://github.com/fstirlitz/luaparse)
  - [x] Custom AST to code that maintain line formatting (not indentation for now)
  - [x] Hooking capability for adding inline hooks (without touching the line formattation) 
  - [x] Hooking capability for adding inline hooks (without touching the line formattation) 

## Leap v1 added features
  - [X] Arrow functions
  - [X] Classes
  - [X] Decorators
  - [X] Default value
  - [X] New keyword
  - [X] Not equal (!=)
  - [X] Type checking
  - [ ] Unpack (...)

## [Lua GLM (cfxlua)](https://github.com/citizenfx/lua/tree/luaglm-dev/cfx#power-patches) power patches parsing support
  - [X] Compound Operators
  - [X] Safe Navigation
  - [X] In Unpacking
  - [ ] Set Constructors
  - [X] C-Style Comments
  - [X] Compile Time Jenkins' Hashes (``)
  - [ ] Defer
