//coins
const COINS_AT_START = 200;
const BIG_BLIND = 20;

//deck data
const SUITS = ["clubs", "diamonds", "hearts", "spades"];
const CARD_SIZES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

let deck = [];
/**
 * param: nPlayers - number of players that joined the game
 * returns: data        - anything you want
 * returns: messages    - an array that contains message contents that will be sent to each player. except `your turn, make you move` stuff, they will be appended by platform
 * returns: playerIndex - index of player starting the game (0, nPlayers-1)
 */
exports.init = function(nPlayers) {
    generateDeck();

    let data = {
        //totals: initTotals(nPlayers),
        roles: initRoles(nPlayers),
        hands: dealHands(nPlayers),
        //individual_pots:
        //total_pot:
    }
    return [data, create_messages(data, nPlayers), 0];
}

function create_messages(data, nPlayers){
    let messages = [];
    for(let i=0; i<nPlayers; ++i){
        messages[i] = "";
    }

    for(let i=0; i<nPlayers; ++i){
        messages[i] += printHand(data.hands[i]); 
    }
    return messages;
}



/**
 * param: data              - you know what this is
 * param: playerIndex       - index of player making the move
 * param: move              - the input move made by player. this parameter will be one of the strings defined in game settings
 * returns: isValid         - is the move valid. if false you can omit other return parameters
 * returns: reason          - (optional) in case if move is invalid, you can send the reason. (ex: for poker, no budget for raising)
 * returns: nextData        - check init() function
 * returns: messages        - check init() function
 * returns: nextPlayerIndex - check init() function
 */
exports.transition = function(data, playerIndex, move) {
    var isValid = /* TODO: check if move is valid for given data */false;

    if (!isValid) {
        return [isValid, reason];
    }

    return [isValid, nextData, messages, nextPlayerIndex];
}

/**
 * param: data
 * returns: false or [messages]
 *   messages: list of messages that will be sent to players, will be appended to transition messages
 */
exports.hasEnded = function(data) {
    var ended = /* TODO: check if game has ended for given data */false;
    if (!ended) {
        return ended;
    }

    return [messages];
}

//coin methods
function initTotals(nPlayers){
    let totals = [];
    for(let i=0; i<nPlayers; ++i){
        totals[i] = COINS_AT_START; 
    }
    return totals;
}

//roles
function initRoles(nPlayers){
    let roles = [];
    for(let i=0; i<nPlayers; ++i){
        roles[i] = "";
    }

    roles[nPlayers-3] = "dealer";
    roles[nPlayers-2] = "sb"    //before last
    roles[nPlayers-1] = "bb"    //last element

    return roles;
}

//deck methods
function generateDeck(){
    for(let i=0; i<SUITS.length; ++i){
        for(let j=0; j<CARD_SIZES.length; ++j){
            deck.push({
                suit: SUITS[i],
                value: CARD_SIZES[j]
            });
        }
    }
    shuffleDeck();
}


function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function dealHands(nPlayers){
    let hands = [];
    for(let i=0; i<nPlayers; ++i){
        hands.push([deck.pop(), deck.pop()]);
        console.log(deck.length);
    }
    return hands;
}

function printHand(hand){
    return "You have the " + hand[0].value + " of " + hand[0].suit 
    + " and the " + hand[1].value + " of " + hand[1].suit + 
    " in your hand.";
}

