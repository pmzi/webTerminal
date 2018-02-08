//Let's get the needed classes and files for initializing

const config = require("../../config/config");

const KeyboardClass = require("./Keyboard");

const CommandsClass = require("./Commands");



//Let's Roll!

const Keyboard = new KeyboardClass(config.wrapperId);

const Command = new CommandsClass(config.serverAddress,config.api);

//Add Event Listener For When User Press Enter

document.addEventListener("terminal:submit",(e)=>{

    Command.execute(e.detail);

})