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

        this.needHelpRegex = /((.+?)--help)|((.+?)-h)/i;

        this.commands = [

            {
                "login": {

                    "username": {
                        "required": true,
                        "name":"userName",
                        "default":null,
                        "description":"username for the login"
                    },
                    "password": {
                        "required": true,
                        "name":"dd",
                        "default":null,
                        "description":"password for the login"
                    }

                },
                "url": "http://localhost/a.php",
                "method": "post",
                "auth": false,
                "description":"A Method For Authenticating Users."
            }

        ];

        let terminalLoadEvent = new Event("terminal:load");

        setTimeout(()=>{

            document.dispatchEvent(terminalLoadEvent);

        },500)


        // axios.get(serverAddress,{api:api}).then((result)=>{
        //     let terminalSubmitEvent = new Event("terminal:load");
        //     document.dispatchEvent(terminalSubmitEvent);
        //     this.commands = result.data;
        // }).catch(()=>{
        //     let terminalSubmitEvent = new Event("terminal:failed");
        //     document.dispatchEvent(terminalSubmitEvent);
        //
        // });
    }

    async execute(commandText){

        this.logger._commitUserInput();

        let commandName = this._getCommandName(commandText).toLowerCase();

        // default commands

        if(this._defaultCommands(commandName)) return;

        let command = {};

        if(command = this._findOrFail(commandName)){

            if(this._needsHelp(commandText)){
                this._showHelp(command,commandName);
                this.logger._reGenerateUserInput();
                return;
            }

            if(command.auth == true && this.auth == false){
                this.logger.error("Command Not Allowed In Guest Mode!");
                this.logger._reGenerateUserInput();
                return;
            }

            if(this._countParameters(commandText) != this._countRequiredParameters(command[commandName])){//some parameters are missing!

                let requiredParametersLength = this._countRequiredParameters(command[commandName]);

                let parametersLength = this._countParameters(commandText);

                for(let i =0;i<requiredParametersLength-parametersLength;i++){

                    let item = this._getCommandByIntIndex(command[commandName],i+parametersLength);

                    commandText += " "+await this.logger.getParameter(item.name);

                    this.logger._commitUserInput();

                }

            }

            this.logger.message("Executing The Commands...");

            //We Are All Good!

            if(commandName == "login"){
                let commandObj = this._getFormData(commandText,command[commandName]);
                this._processLogin(commandObj,command);
                return;
            }else if(commandName == "logout"){
                let commandObj = this._getFormData(commandText,command[commandName]);
                this._processLogout(commandObj,command);
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
                    this.logger._reGenerateUserInput();
                }).catch((result)=>{
                    result = JSON.parse(result);
                    this.logger.error(result.text);
                    this.logger._reGenerateUserInput();
                });

            }else{

                let commandObj = this._getFormData(commandText,command[commandName]);

                axios.post(command.url,commandObj).then((result)=>{
                    result = JSON.parse(result);
                    this.logger.success(result.text);
                    this.logger._reGenerateUserInput();
                }).catch((result)=>{
                    result = JSON.parse(result);
                    this.logger.error(result.text);
                    this.logger._reGenerateUserInput();
                });

            }

        }else{

            this.logger.error("Command Not Found!");

            this.logger._reGenerateUserInput();

        }

    }

    /*
     Privates!:)
     */

    _defaultCommands(commandName){
        switch (commandName.toLowerCase()){
            case "cls":

                this.logger.clear();

                break;
            case "restart":

                window.location.reload(true);

                break;
            case "bye":

                this.logger.clear();

                window.close();

                document.dispatchEvent(new Event("terminal:exit"));

                break;
            case "exit":

                this.logger.clear();

                window.close();

                document.dispatchEvent(new Event("terminal:exit"));

                break;
            default:

                return false;

                break;
        }

        return true;

    }

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

        axios.post(command.url,commandObj).then((result)=>{
            result = result.data;
            this.api = result.api;
            this.auth = true;
            window.userName = result.username;
            this.logger.success("You Have Logged In! Welcome <b>"+result.username+"</b>!");
            this.logger._reGenerateUserInput();
        }).catch((result)=>{
            result = JSON.parse(result)
            this.logger.error(result.text);
            this.logger._reGenerateUserInput();
        });

    }

    _processLogout(){

        if(this.auth == false){
            this.logger.error("You Have Not Been Logged In!");
            return false;
        }

        this.auth = false;

        this.api = null;

        window.username = null;

    }

    _needsHelp(commandText){
        if(this.needHelpRegex.test(commandText)){
            return true;
        }
        return false;
    }

    _showHelp(command,commandName){

        this.logger.message("Further description on "+commandName+":");

        this.logger.message("<b>Description: </b>"+command.description);

        this.logger.message("<b>Authentication Required: </b>"+command.auth);

        this.logger.message("<b>Method's Params:</b>");

        for(let item in command[commandName]){
            this.logger.message("\t"+command[commandName][item].name+":");
            this.logger.message("\t\tDescription: "+command[commandName][item].description || "-");
            this.logger.message("\t\tRequired: "+command[commandName][item].required);
            this.logger.message("\t\tDefault: "+command[commandName][item].default);
        }

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