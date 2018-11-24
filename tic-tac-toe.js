const COLUMNS = ["a", "b", "c"];

const COL_TO_IND = {"a": 0, "b": 1, "c": 2};

const ROWS = ["1", "2", "3"];

const FIELD_LENGTH = COLUMNS.length;

exports.init = function(nPlayers) {
    return [initBoard(), initMessages(), 1];
}

exports.transition = function(data, playerIndex, move) {
    let isValid = true;

    move = move.toLowerCase();
    const col = move.charAt(0);
    const row = move.charAt(1);
    
    const indexes = getIndexes(col, row); 

    if(data[indexes.r][indexes.c] != "."){ 
        return [false, "Field already ticked"];
    } 
    else data[indexes.r][indexes.c] = playerToString(playerIndex);

    const printedState = module.exports.printState(data);

    const nextPlayerIndex = getNextPlayerIndex(playerIndex);

    return [true, data, [printedState, printedState], nextPlayerIndex];
}

exports.hasEnded = function(data) {
    //one diagonal direction
    if(data[0][0] == data[1][1] && data[0][0] == data[2][2]){
        if(data[0][0] == "O") return ["Player1 won!"];
        else if(data[0][0] == "X") return ["Player2 won!"];
    }

    //other diagonal direction
    if(data[0][2] == data[1][1] && data[0][2] == data[2][0]){
        if(data[0][2] == "O") return ["Player1 won!"];
        else if(data[0][2] == "X") return ["Player2 won!"];
    }

    //columns
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[0][i] == data[1][i] && data[0][i] == data[2][i]){
            if(data[0][i] == "O") return ["Player1 won!"];
            else if(data[0][i] == "X") return ["Player2 won!"];
        }
    }

    //rows
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[i].every(field => field == "O")){
            return ["Player1 won!"];
        }

        if(data[i].every(field => field == "X")){
            return ["Player2 won!"];
        }
    }

    //are there fields left
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[i].some(field => field == ".")){
            return false;
        }
    }

    return ["Draw, no empty fields left"];
}

function initBoard(){
    let board = new Array();
    
    for(let i=0; i<FIELD_LENGTH; ++i){
        let column = Array();
        for(let j=0; j<FIELD_LENGTH; ++j) column.push('.');
        board.push(column);
    }
    return board;
}

function initMessages(){
    return "Player 1 up first, have a good game!"
}

function getIndexes(col, row){
    return { c: COL_TO_IND[col], r: parseInt(row)-1}
}

function getNextPlayerIndex(currPlayerIndex){
    return currPlayerIndex % 2 + 1;
}

function playerToString(playerIndex){
    return playerIndex == 1 ? "O" : "X";
}

module.exports.printState = function(data){
    let msg = "The current state of the board is:\n";
    
    msg += "  " + COLUMNS.join(" ") + "\n";

    let rowStrings = [];
    for(let i=0; i<FIELD_LENGTH; ++i){
        rowStrings.push(ROWS[i] + " " + data[i].join(" "));
    }
    
    msg += rowStrings.join("\n") + "\n";
    return msg;
}