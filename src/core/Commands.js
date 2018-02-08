const Logger = require("./Logger");

class Commands {
    
    constructor(serverAddress,api,wrapperId){

        //

        this.logger = new Logger(wrapperId);

        this.commands;

    }

    execute(command){



    }
    
}

module.exports = Commands;