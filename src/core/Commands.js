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

        this.auth = false;

        this.api = "";

        this.logger = new Logger(wrapperId);

        this.commands;

        //Let's Get Commands

        this.optionalParamRegex = /--(.+?)=([^ ]+)/;

        this.commands = [

            {
                "login": {

                    "username": {
                        "required": true,
                        "name":"userName",
                        "default":null
                    },
                    "password": {
                        "required": true,
                        "name":"dd",
                        "default":null
                    }

                },
                "url": "http://localhost/a.php",
                "method": "post",
                "auth": false
            }

        ];

        let terminalLoadEvent = new Event("terminal:load");

        setTimeout(()=>{

            document.dispatchEvent(terminalLoadEvent);

        },500)


        // axios.get(serverAddress,{api:api}).then(()=>{
        //     let terminalSubmitEvent = new Event("terminal:load");
        //     document.dispatchEvent(terminalSubmitEvent);
        //
        // }).catch(()=>{
        //     let terminalSubmitEvent = new Event("terminal:failed");
        //     document.dispatchEvent(terminalSubmitEvent);
        //
        // });
    }

    async execute(commandText){

        this.logger.message("Executing The Commands...");

        let commandName = this._getCommandName(commandText).toLowerCase();

        let command = {};

        if(command = this._findOrFail(commandName)){

            if(command.auth == true && this.auth == false){
                this.logger.error("Command Not Allowed In Guest Mode!");
                return;
            }

            if(this._countParameters(commandText) != this._countRequiredParameters(command[commandName])){//some parameters are missing!

                this.logger._commitUserInput();

                let requiredParametersLength = this._countRequiredParameters(command[commandName]);

                let parametersLength = this._countParameters(commandText);

                for(let i =0;i<requiredParametersLength-parametersLength;i++){

                    let item = this._getCommandByIntIndex(command[commandName],i+parametersLength);

                    commandText += " "+await this.logger.getParameter(item.name);

                    this.logger._commitUserInput();

                }

                this.logger._reGenerateUserInput();

            }

            //We Are All Good!

            if(commandName == "login"){
                let commandObj = this._getFormData(commandText,command[commandName]);
                this._processLogin(commandObj,command);
                return;
            }



            if(command.method.toLowerCase() == "get"){

                let commandObj = this._getCommandObject(commandText,command[commandName]);

                axios({
                    method: 'get',
                    url: command.url,
                    params: commandObj
                }).then((result)=>{
                    result = JSON.parse(result);
                    this.logger.success(result.text);
                }).catch((result)=>{
                    result = JSON.parse(result);
                    this.logger.error(result.text);
                });

            }else{

                let commandObj = this._getFormData(commandText,command[commandName]);

                axios.post(command.url,commandObj).then((result)=>{
                    result = JSON.parse(result);
                    this.logger.success(result.text);
                }).catch((result)=>{
                    result = JSON.parse(result);
                    this.logger.error(result.text);
                });

            }

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

    _processLogin(commandObj,command){

        if(this.auth == true){
            this.logger.error("You Have Already Logged In!");
            return false;
        }

        console.log(commandObj)

        axios.post(command.url,commandObj).then((result)=>{
            result = JSON.parse(result);
            this.api = result.api;
            this.auth = true;
            window.userName = result.username;
            this.logger.success("You Have Logged In! Welcome <b>"+result.username+"</b>!")
        }).catch((result)=>{
            result = JSON.parse(result)
            this.logger.error(result.text);
        });

    }

    _getFormData(commandText,command){

        commandText = commandText.trim().split(" ");

        commandText.shift();

        let ret = new FormData();
        let i = 0;
        for(let item in command){
            while(this.optionalParamRegex.test(commandText[i])){
                i++;
            }
            ret.append(item,commandText[i]);
            i++;
        }

        for(let item of commandText){
            if(this.optionalParamRegex.test(item)){
                let matches = this.optionalParamRegex.exec(item);
                ret.append(matches[1],matches[2]);
            }
        }

        if(command.auth == true){
            ret.append("api",this.api);
        }
        return ret;
    }

    _getCommandObject(commandText,command){

        commandText = commandText.trim().split(" ");

        commandText.shift();

        let ret = {};
        let i = 0;
        let temp = "";
        for(let item in command){
            while(this.optionalParamRegex.test(commandText[i])){
                i++;
            }
            ret[item] = commandText[i];
            i++;
        }

        for(let item of commandText){
            if(this.optionalParamRegex.test(item)){
                let matches = this.optionalParamRegex.exec(item);
                ret[matches[1]] = matches[2];
            }
        }

        if(command.auth == true){
            ret.api = this.api;
        }
        return ret;

    }

    _countParameters(commandText){
        let newCmd = commandText.split(" ").filter(item=>!(this.optionalParamRegex.test(item)) && item.trim() != "");
        return newCmd.length-1;
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