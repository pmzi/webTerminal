const Logger = require("./Logger");

const axios = require("axios");

/*

List Of Commands:

 [

 {
 "commandname": {

 "username": {
 "required": true
 }

 },
 "url": "http://google.com",
 "method": "post",
 "auth": true
 }

 ]


 */
//login should be login

class Commands {
    
    constructor(serverAddress,api,wrapperId){

        //

        this.logger = new Logger(wrapperId);

        this.commands = [

            {
                "login": {

                    "username": {
                        "required": true,
                        "name":"userName",
                        "default":null
                    },
                    "Dd": {
                        "required": true,
                        "name":"dd",
                        "default":null
                    },
                    "Ddddd": {
                        "required": true,
                        "name":"dd",
                        "default":null
                    }

                },
                "url": "http://google.com",
                "method": "post",
                "auth": true
            }

        ];

    }

    async execute(commandText){

        let commandName = this._getCommandName(commandText).toLowerCase();

        let command = {};

        if(command = this._findOrFail(commandName)){


            if(this._countParameters(commandText) != this._countRequiredParameters(command[commandName])){//some parameters are missing!

                this.logger._commitUserInput();

                let requiredParametersLength = this._countRequiredParameters(command[commandName]);

                let parametersLength = this._countParameters(commandText);

                for(let i =0;i<requiredParametersLength-parametersLength;i++){

                    let item = this._getCommandByIntIndex(command[commandName],i+parametersLength);

                    this.commndText += " "+await this.logger.getParameter(item.name);

                    this.logger._commitUserInput();

                }

                this.logger._reGenerateUserInput();

            }

            //We Are All Good!



        }else{

            this.logger.error("Command Not Found!");

        }

    }

    /*
        Privates!:)
     */

    _getCommandName(commandText){
        let commandName = "";
        if(commandText.indexOf(" ") != -1){
            commandName = commandText.split(" ");
            commandName = commandName.shift();
        }else{
            commandName = commandText;
        }
        return commandName;
    }

    _getCommandByIntIndex(command,num){

        let i =0;

        for(let item in command){

            if(command[item].required){
                if(i == num){
                    return command[item];
                }
                i++;
            }

        }

    }

    _countParameters(commandText){

        commandText = commandText.split(" ");

        commandText.shift();

        return commandText;

    }

    _countParameters(commandText){
        return commandText.split(" ").length -1;
    }

    _countRequiredParameters(command){

        let i = 0;

        for(let item in command){

            if(command[item].required){
                i++;
            }

        }

        return i;

    }

    _findOrFail(command){
        command = command.toLowerCase();
        let commandObj = this.commands.filter(item => item[command] );
        if(commandObj.length != 0){
            return commandObj[0];
        }else{
            return false;
        }
    }
    
}

module.exports = Commands;