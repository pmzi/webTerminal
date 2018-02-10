class Logger{

    constructor(wrapperId){

        this.wrapperId = wrapperId;
        this.wrapper = document.getElementById(wrapperId);

    }

    message(text){
        let lineElement = document.createElement("div");
        lineElement.className = "line message";
        let textElement = document.createElement("pre");
        textElement.innerHTML = text;
        lineElement.appendChild(textElement);
        this.wrapper.appendChild(lineElement);

    }
    success(text){
        let lineElement = document.createElement("div");
        lineElement.className = "line success";
        let textElement = document.createElement("span");
        textElement.innerHTML = text;
        lineElement.appendChild(textElement);
        this.wrapper.appendChild(lineElement);

    }
    error(text){
        let lineElement = document.createElement("div");
        lineElement.className = "line error";
        let textElement = document.createElement("span");
        textElement.innerHTML = text;
        lineElement.appendChild(textElement);
        this.wrapper.appendChild(lineElement);

    }
    warning(text){

        let lineElement = document.createElement("div");
        lineElement.className = "line warning";
        let textElement = document.createElement("span");
        textElement.innerHTML = text;
        lineElement.appendChild(textElement);
        this.wrapper.appendChild(lineElement);

    }

    getParameter(paramName){

        return new Promise((resolve)=>{

            this._generatePartialUserInput(paramName);

            document.addEventListener("terminal:submitPartial",(e)=>{

                resolve(e.detail.trim());

            });

        });

    }

    _commitUserInput(){

        let currUserInput = document.querySelector("#"+this.wrapperId+">[data-active=true]")

        //deActivating Current User Input

        currUserInput.setAttribute("data-active","false");

        //Removing The Cursor

        currUserInput.removeChild(currUserInput.querySelector("#cursor"));



    }
    _reGenerateUserInput(){

        let lineElement = document.createElement("div");
        lineElement.className = "line userInput";
        lineElement.setAttribute("data-active","true");

        let userNameElement = document.createElement("span");
        userNameElement.classList = "userName";
        userNameElement.innerText = (window.userName || "Guest")+">";

        let contentOfTheLineElement = document.createElement("span");
        contentOfTheLineElement.className = "contentOfTheLine";

        let cursor = document.createElement("span");
        cursor.id = "cursor";
        cursor.innerText = "|";

        //    Let's Append

        lineElement.appendChild(userNameElement);
        lineElement.appendChild(contentOfTheLineElement);
        lineElement.appendChild(cursor);

        this.wrapper.appendChild(lineElement);

    }

    _generatePartialUserInput(message){

        let lineElement = document.createElement("div");
        lineElement.className = "line userPartialInput";
        lineElement.setAttribute("data-active","true");

        let userNameElement = document.createElement("span");
        userNameElement.classList = "userName";
        userNameElement.innerText = message+":";

        let contentOfTheLineElement = document.createElement("span");
        contentOfTheLineElement.className = "contentOfTheLine";

        let cursor = document.createElement("span");
        cursor.id = "cursor";
        cursor.innerText = "|";

        //    Let's Append

        lineElement.appendChild(userNameElement);
        lineElement.appendChild(contentOfTheLineElement);
        lineElement.appendChild(cursor);

        this.wrapper.appendChild(lineElement);

    }

}

module.exports = Logger;