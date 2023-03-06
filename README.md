<h1 align="center">LEAP</h1>

`LEAP` (**L**ua **e**xtension **a**ccessibility **p**reprocessor) is a fast pre-processor of a "modernized" and extended version of lua that pre-processes in pure executable lua.  
Think of it as an effective "modernity" leap into the future to make lua a feature-rich language.  
In fact LEAP is primarily intended for FiveM, this however does not deny the possibility of extension to wider horizons.

### Shadow writing

LEAP uses a **shadow writing** system (*we called it that*) that works in the following way:
After preprocessing the files, FiveM will read the files, cache them and start the resource with those cached files as soon as we start the resource, we instantly rewrite the old files so that it looks like nothing happened. This will be done in very few ms (5/10), so from VSC or any other IDE that has the auto refresh feature when updating a file it will look like it was never overwritten

<div align="center">
 <img src="https://user-images.githubusercontent.com/55803068/223179277-45c58f41-6a65-4e42-a18e-a5aa786155e0.png"  width="60%" height="60%">
</div>

## Commands
### parser restart
`parser restart <resource>`
restarts the resource by preprocessing it before restarting it using *shadow writing*, this command is quite useful when creating a resource, since you don't have to rebuild it every time and restart the resource but it's like everything in one command.

**TIP**: these commands can also be used in the cfg after the LEAP startup.

### parser build
`parser build <resource>`
Pre processes the resource by creating a subfolder named `build` that contains the pre-processed version of the resource

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


### parser rebuild
`parser rebuild`
