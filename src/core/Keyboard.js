class Keyboard {
    constructor(wrapperId) {

        this.wrapperId = wrapperId;

        this.wrapper = document.getElementById(wrapperId);

        this.History = require("./History");

        // For KeyBoards

        this.keypress = false;

        this.control = true;

        // this.keyboard

        /*

         Let's initialize the terminal's events for typing and submitting commands

         */

        window.onkeypress = (e) => {

            this.keypress = true;

            this.control = false;

            // if (e.which >= 48 && e.which <= 90) {
            //     //For Regular keys
            //     this.type(String.fromCharCode(e.which))
            // } else if (e.which >= 96 && e.which <= 105) {
            //     //For Calculating Keys
            //     this.type(String.fromCharCode(e.keyCode - 48))
            // }

            if(e.keyCode == 13){//enter

                if(this.wrapper.querySelector("[data-active=true]").className.split(" ").includes("userPartialInput")){
                    let terminalSubmitEvent = new CustomEvent("terminal:submitPartial",{detail:this.wrapper.querySelector("[data-active=true]>.contentOfTheLine").innerText});
                    document.dispatchEvent(terminalSubmitEvent);
                }else{
                    let terminalSubmitEvent = new CustomEvent("terminal:submit",{detail:this.wrapper.querySelector("[data-active=true]>.contentOfTheLine").innerText});
                    document.dispatchEvent(terminalSubmitEvent);
                }

            }else {

                this.type(e.key);

            }
        }

        document.addEventListener("paste",(e)=>{
            this.type(e.clipboardData.getData("text/plain"));
        })

        window.onkeydown = (e)=>{
            setTimeout(()=>{
                if(this.keypress){
                    this.keypress = false;
                }else{
                    switch (e.key.toLowerCase()){
                        case "backspace":
                            this.backSpace();
                            break;
                        case "control":
                            this.control = true;
                            break;
                        case "a":
                            //@todo change selection
                            break;
                    }
                }
            },20);


        }




    }

    type(char){

        let activeLine = this.wrapper.querySelector("[data-active=true]>.contentOfTheLine");

        activeLine.innerText += char;

    }

    backSpace(){

        let activeLine = this.wrapper.querySelector("[data-active=true]>.contentOfTheLine");

        let temp = activeLine.innerText.split("");

        temp.pop();

        activeLine.innerText = temp.join("");


    }
}

module.exports = Keyboard;