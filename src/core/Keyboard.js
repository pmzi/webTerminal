class Keyboard {
    constructor(wrapperId) {

        this.wrapperId = wrapperId;

        this.wrapper = document.getElementById(wrapperId);

        /*

         Let's initialize the terminal's events for typing and submitting commands

         */

        window.onkeydown = (e) => {
            // if (e.which >= 48 && e.which <= 90) {
            //     //For Regular keys
            //     this.type(String.fromCharCode(e.which))
            // } else if (e.which >= 96 && e.which <= 105) {
            //     //For Calculating Keys
            //     this.type(String.fromCharCode(e.keyCode - 48))
            // }

            if(e.keyCode == 8 || e.keyCode == 46){//backspace

                this.backSpace();

            }else if(e.keyCode == 13){//enter

                let terminalSubmitEvent = new CustomEvent("terminal:submit",{detail:this.wrapper.querySelector("[data-active=true]>.contentOfTheLine").innerText});

                document.dispatchEvent(terminalSubmitEvent);

            }else {

                this.type(String.fromCharCode(e.keyCode));

            }
        }


    }

    type(char){

        let activeLine = this.wrapper.querySelector(".userInput[data-active=true]>.contentOfTheLine");

        activeLine.innerText += char;

    }

    backSpace(){

        let activeLine = this.wrapper.querySelector(".userInput[data-active=true]>.contentOfTheLine");

        let temp = activeLine.innerText.split("");

        temp.pop();

        activeLine.innerText = temp.join("");


    }
}

module.exports = Keyboard;