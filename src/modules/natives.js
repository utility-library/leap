import axios from "axios"
import fs from 'fs'

export let Natives

// * Fetch and merge the natives data into the Natives export
axios.get("https://runtime.fivem.net/doc/natives.json").then((answer) => {
    Natives = answer.data;

    axios.get("https://runtime.fivem.net/doc/natives_cfx.json").then((answer) => {
        Natives = { ...Natives, ...answer.data  };
    })
})

