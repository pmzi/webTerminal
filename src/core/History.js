class History{

    constructor(){

        this.history = [];

        this.current = 1;

    }

    add(command){

        this.history.push(command);

        this.current = this.history.length;

    }

    nextHistory(){

        if(this.current < this.history.length -1){

            this.current++;

            return this.history[this.current];

        }else{

            return this.history[this.current];

        }

    }

    prevHistory(){

        if(this.current > 0){

            this.current--;

            return this.history[this.current];



        }else{

            return this.history[this.current];

        }


    }

    clearHistory(){

        // this.history = [];

    }

}

module.exports = History;