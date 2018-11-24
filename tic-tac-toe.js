const COLUMNS = ["a", "b", "c"];

const COL_TO_IND = {"a": 0, "b": 1, "c": 2};

const ROWS = ["1", "2", "3"];

const FIELD_LENGTH = COLUMNS.length;

exports.init = function(nPlayers) {
    let data = initBoard();
    let printedState = printState(data);
    return [data, [printedState, printedState], 0];
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

    const printedState = printState(data);

    const nextPlayerIndex = getNextPlayerIndex(playerIndex);

    return [true, data, [printedState, printedState], nextPlayerIndex];
}

exports.hasEnded = function(data) {
    let msg;
    //one diagonal direction
    if(data[0][0] == data[1][1] && data[0][0] == data[2][2]){
        if(data[0][0] == "O"){
            msg = "Player1 won!";
            return [msg, msg];
        }
        else if(data[0][0] == "X"){
            msg = "Player2 won!";
            return [msg, msg];
        } 
    }

    //other diagonal direction
    if(data[0][2] == data[1][1] && data[0][2] == data[2][0]){
        if(data[0][2] == "O"){
            msg = "Player1 won!";
            return [msg, msg];
        }
        else if(data[0][2] == "X"){
            msg = "Player2 won!";
            return [msg, msg];
        }
    }

    //columns
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[0][i] == data[1][i] && data[0][i] == data[2][i]){
            if(data[0][i] == "O"){
                msg = "Player1 won!";
                return [msg, msg];
            }
            else if(data[0][i] == "X"){
                msg = "Player2 won!";
                return [msg, msg];
            }
        }
    }

    //rows
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[i].every(field => field == "O")){
            msg = "Player1 won!";
            return [msg, msg];
        }

        if(data[i].every(field => field == "X")){
            msg = "Player2 won!";
            return [msg, msg];
        }
    }

    //are there fields left
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[i].some(field => field == ".")){
            return false;
        }
    }

    msg = "Draw, no empty fields left";
    return [msg, msg]
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


function getIndexes(col, row){
    return { c: COL_TO_IND[col], r: parseInt(row)-1}
}

function getNextPlayerIndex(currPlayerIndex){
    return (currPlayerIndex + 1) % 2;
}

function playerToString(playerIndex){
    return playerIndex == 1 ? "X" : "O";
}

function printState(data){
    let msg = "The current state of the board is:\n";
    
    msg += "  " + COLUMNS.join(" ") + "\n";

    let rowStrings = [];
    for(let i=0; i<FIELD_LENGTH; ++i){
        rowStrings.push(ROWS[i] + " " + data[i].join(" "));
    }
    
    msg += rowStrings.join("\n") + "\n";
    return msg;
}