//coins
const COINS_AT_START = 200;
const BIG_BLIND = 20;

//deck data
const SUITS = ["clubs", "diamonds", "hearts", "spades"];
const CARD_SIZES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

let deck = [];

class Player{
    constructor(){
        this.role = ""
        this.total = 0;
        this.inPot = 0;
        this.hand = [];
        this.inRound = true;
    }
}

function getMessage(player){
    const handMsg = "Your hand: " + player.hand[0].value + " of " + player.hand[0].suit 
    + " and " + player.hand[1].value + " of " + player.hand[1].suit + "\n\n";

    const potMsg = "Your bet this round so far: " + player.inPot + "\n" +
    "Remaining coins: " + player.total + "\n";

    let roleMsg = "";
    if(player.role == "bb") roleMsg = "You are the big blind\n";
    else if(player.role == "sb") roleMsg = "You are the small blind\n";
    else if(player.role == "dealer") roleMsg = "You are the dealer\n";

    return handMsg + potMsg + roleMsg; 
};

/**
 * param: nPlayers - number of players that joined the game
 * returns: data        - anything you want
 * returns: messages    - an array that contains message contents that will be sent to each player. except `your turn, make you move` stuff, they will be appended by platform
 * returns: playerIndex - index of player starting the game (0, nPlayers-1)
 */
exports.init = function(nPlayers) {
    generateDeck();
    let activePlayerIndex = 0;

    let players = initPlayers(nPlayers);
    initRoles(players);
    initTotals(players); 
    let pot = initPots(players);
    dealHands(players);

    
    let data = {
        players: players,
        round_max: BIG_BLIND,
        roundEnd: 0,
        pot: pot,
        visibleCards: [],
        gameState: 0
    }

    return [data, create_messages(data, activePlayerIndex), activePlayerIndex];
}

function create_messages(data, activePlayerIndex, move){
    let messages = [];

    let visibleCardsMessage = ""
    if(data.visibleCards.length != 0){
        visibleCardsMessage += "The visisble cards are:\n";

        for(let i=0; i<data.visibleCards.length; ++i){
            visibleCardsMessage += data.visibleCards[i].value + " of " + data.visibleCards[i].suit + "\n";
        }
    }

    for(let i=0; i<data.players.length; ++i){
        messages[i] = visibleCardsMessage;
        if(i == activePlayerIndex){
            messages[i] += "It's your move!\n";
        }
        messages[i] += "The total pot is: " + data.pot + "\n";
        messages[i] += getMessage(data.players[i]);
        if(move){
            messages[i] += "Player did: " + 
        }
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
exports.transition = function(data, playerIndex, move, params) {
    if(move == "fold") data.players[playerIndex].inRound = false;
    else if(move == "call"){
        const diff = data.round_max - data.players[playerIndex].inPot;
        data.players[playerIndex].total -= diff;
        data.players[playerIndex].inPot += diff;
        data.pot += diff; 
    }
    else if(move == "raise"){
        let raise = parseInt(params["raisenumber"]);
        data.round_max  = raise
        const diff = raise - data.players[playerIndex].inPot;
        data.players[playerIndex].total -= diff;
        data.players[playerIndex].inPot += diff; 
        data.pot += diff; 
        data.roundEnd = playerIndex;
    }

    let nextPlayerIndex = getNextActivePlayerIndex(playerIndex, data); 
    if(nextPlayerIndex === false){
        nextPlayerIndex = data.players.findIndex(p => p.role == "bb");
        data.gameState++;
        let newData = dealCards(data);
        return [true, newData, create_messages(newData, nextPlayerIndex, playerIndex, move), nextPlayerIndex];
    }
    else{
        return [true, data, create_messages(data, nextPlayerIndex, move), nextPlayerIndex];
    }

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

//general game maangement
function initPlayers(nPlayers){
    let players = []
    for(let i=0; i<nPlayers; ++i){
        players.push(new Player());
    }
    return players;
}

function getNextActivePlayerIndex(playerIndex, data){
    let nextPlayerIndex = getNextPlayerIndex(playerIndex, data.players.length);
    if(nextPlayerIndex == data.roundEnd){
        return false;
    }

    while(!data.players[nextPlayerIndex].inRound){
        if(nextPlayerIndex == data.roundEnd){
            return false;
        }
        nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, data.players.length); 
    }
    return nextPlayerIndex;
}

function getNextPlayerIndex(activePlayerIndex, nPlayers){
    return (activePlayerIndex + 1) % nPlayers;
}

//roles
function initRoles(players){
    const nPlayers = players.length;

    players[nPlayers-3].role = "dealer";
    players[nPlayers-2].role = "sb"    //before last
    players[nPlayers-1].role = "bb"    //last element
}

//coin methods
function initTotals(players){
    for(let i=0; i<players.length; ++i){
        players[i].total = COINS_AT_START; 
    }
}

function initPots(players){
    let pot = 0;
    
    const bbInd = players.findIndex(p => p.role == "bb");
    players[bbInd].total -= BIG_BLIND; 
    players[bbInd].inPot += BIG_BLIND;
    pot += BIG_BLIND;

    const sbInd = players.findIndex(p => p.role == "sb");
    players[sbInd].total -= BIG_BLIND/2;
    players[sbInd].inPot += BIG_BLIND/2 
    pot += BIG_BLIND/2;

    return pot;
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

function dealHands(players){
    for(let i=0; i<players.length; ++i){
        players[i].hand = [deck.pop(), deck.pop()];
    }
}

function dealCards(data){
    if(data.gameState == 1){
        data.visibleCards.push(deck.pop());
        data.visibleCards.push(deck.pop());
        data.visibleCards.push(deck.pop());
    }
    else if(data.gameState == 2 || data.gameState == 3){
        data.visibleCards.push(deck.pop());
    }
    return data;
}