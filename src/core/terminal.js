//Let's get the needed classes and files for initializing

const config = require("../../config/config");

const KeyboardClass = require("./Keyboard");

const CommandsClass = require("./Commands");

//Add Event Listener For When User Press Enter

document.addEventListener("terminal:submit",(e)=>{

    Command.execute(e.detail);

});

document.addEventListener("terminal:load",(e)=>{
    document.querySelector("#"+config.wrapperId+">#terminalLoading").className += " fadeOut";
    setTimeout(()=>{
        document.querySelector("#"+config.wrapperId+">#terminalLoading").style.display = "none";
    },300)

});

document.addEventListener("terminal:exit",()=>{

    document.querySelector(".terminalMsgWrapper:nth-child(3)").style.display = "flex";

})

document.addEventListener("terminal:failed",(e)=>{

    document.querySelector("#"+config.wrapperId+">.terminalMsgWrapper").style.display = "flex";

});

//Let's Roll!

const Keyboard = new KeyboardClass(config.wrapperId);

const Command = new CommandsClass(config.serverAddress,config.api,config.wrapperId);

Command.logger._reGenerateUserInput();//initial