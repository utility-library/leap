fx_version "cerulean"
game "gta5"

files {
    "files/server-identifier.utility",
    "server/addons/*.lua",
    "client/addons/*.lua",
    "client/api.lua",
    "client/html/**.*"
}

client_scripts {
    "config.lua",
    "configs/*.lua",
    --"client/addons/class.lua",

    "client/functions.lua",
    "client/variables.lua",
    "client/init/*.lua",
    "client/managers/*.lua",
    "client/classes/**.lua",
    "client/commands.lua",
    "client/events.lua",
    "client/main.lua",
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "config.lua",
    "configs/*.lua",
    "server/addons/class.lua",

    "server/functions.lua",
    "server/init/*.lua",
    "server/variables.lua",
    
    "server/managers/*.*",

    "server/classes/**.lua",
    "server/commands.lua",
    "server/events.lua",

    "server/main.lua",
}