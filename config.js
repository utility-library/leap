var Config = {}

Config.Dev = GetConvarInt("leap:dev", 0) == 1 ? true : false


// ignore
export {Config}