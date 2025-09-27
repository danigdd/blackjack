'use strict'
let computer_score = 0;
let user_score = 0;
let number_of_hits_user = 0;
let number_of_hits_computer = 0;
let has_game_finished = false;
let winner = "";

const computer_score_tag = document.getElementById("computer-score");
const user_score_tag = document.getElementById("user-score");
const hitButton_tag = document.getElementById('hit-button');
const standButton_tag = document.getElementById("stand-button");
const newCardDivDestinationUser = document.querySelector(".cards-wrap-user .card-deck");
const newCardDivDestinationComputer = document.querySelector(".cards-wrap-computer .card-deck");
const computer_etiquette = document.getElementById("computer-etiquette");
const user_etiquette = document.getElementById("user-etiquette");


const list_of_cards = [
  "AH","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH",
  "AD","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD",
  "AC","2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC",
  "AS","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS"
];

let already_seen_cards = [];

let first_computer_card = chooseCard();
let first_computer_card_file = getCardFile(first_computer_card);
displayCard(first_computer_card_file, true, "first-card-computer");
updateScore(first_computer_card, "computer");

function chooseCard() {
    let card_chosen;
    do {
        card_chosen = list_of_cards[ Math.floor( Math.random() * list_of_cards.length ) ];
    } while ( already_seen_cards.includes(card_chosen) );
    
    pushCardToSeen(card_chosen);
    return card_chosen;
}

function pushCardToSeen(card_chosen) {
    already_seen_cards.push(card_chosen);
}

function getCardFile(card_name) {
    let card_file_name = "resources/cards/" + card_name + ".png";
    return card_file_name
}

function displayCard(card_to_display, is_card_hidden, target_card_position) {
    if (is_card_hidden) {
        const card_position_to_display = document.getElementById(target_card_position);
        card_position_to_display.src = "resources/cards/red_back.png";
        return;
    } else {
        const card_position_to_display = document.getElementById(target_card_position);
        card_position_to_display.src = card_to_display;
        return;
    }
}

function updateScore(card, dest) {
    let value_of_card = getValueFromCard(card);
    switch (dest) {
        case "computer":
            computer_score += +value_of_card;
            break;
        
        case "user":
            user_score += +value_of_card;
            break;

        default:
            break;  
    }
}

function updateScoreWithHiddenCard(second_no_hidden_card) {
    let score_second_computer_card = getValueFromCard(second_no_hidden_card);
    computer_score_tag.textContent = score_second_computer_card;
}

function getValueFromCard(card) {
    let value = 0;
    if (card.length == 3) value = card.substring(0, 2); //10H => first two digits "10"
    else value = card.charAt(0); //3H => first digit "3"

    if (card.charAt(0) == "A") value = 1; //AH => value = 1
    else if (card.charAt(0) == "J" || card.charAt(0) == "Q" || card.charAt(0) == "K") value = 10; //JH, QH, KH => all get a value of 10

    return value;
}

function setUpComputerDeck() {
    let [second_computer_card, second_computer_card_file] = createNewCard();
    displayCard(second_computer_card_file, false, "second-card-computer");
    updateScore(second_computer_card, "computer");
    updateScoreWithHiddenCard(second_computer_card);
}

function createNewCard() {
    let card_created = chooseCard();
    let card_created_file = getCardFile(card_created);
    return [card_created, card_created_file];
}
function setUpUserDeck() {
    let [first_user_card, first_user_card_file] = createNewCard();
    displayCard(first_user_card_file, false, "first-card-user");
    updateScore(first_user_card, "user");

    let [second_user_card, second_user_card_file] = createNewCard();
    displayCard(second_user_card_file, false, "second-card-user");
    updateScore(second_user_card, "user");

    user_score_tag.textContent = user_score;
}

function hitButton() {
    hitButton_tag.addEventListener("click", () => {
        hitCard("User");
        if ( checkWinner() ) announceWinner();
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function standButton() {
    standButton_tag.addEventListener("click", async () => {
        await delay(500);
        displayFirstDealerCard();
        await delay(500);
        while (computer_score < 17) {
            await delay(500); 
            hitCard("Computer");
        }
        has_game_finished = true;
        if (checkWinner() == true) announceWinner();
    });
}

function displayFirstDealerCard() {
    displayCard(first_computer_card_file, false, "first-card-computer");
    computer_score_tag.textContent = computer_score;
}

function checkWinner() {
    let scoreDifferenceComputer = Math.abs(21 - computer_score);
    let scoreDifferenceUser = Math.abs(21 - user_score);
    if (user_score > 21) { //user gets busted
        winner = "Computer";
        return true;
    }

    else if (computer_score > 21 && user_score < 21 && has_game_finished == true) { //computer gets busted
        winner = "User";
        return true;
    }

    else if (computer_score == user_score && has_game_finished == true) { //draw (same score)
        winner = "Draw";
        return true;
    }

    else if (scoreDifferenceComputer < scoreDifferenceUser && has_game_finished == true) { //computer is closer to 21
        winner = "Computer";
        return true;
    }

    else if (scoreDifferenceComputer > scoreDifferenceUser && has_game_finished == true) { //user is closer to 21
        winner = "User";
        return true;
    }

    return false; //no winner yet
}

function createNewCardDiv(target) {
    const newCardDiv = document.createElement("img");
    let idName = "hit-" + target + "-card";
    newCardDiv.id = (target == "user") ? (idName + number_of_hits_user) : (idName + number_of_hits_computer);
    const newCardDivDestination = (target == "user") ? newCardDivDestinationUser : newCardDivDestinationComputer;
    newCardDivDestination.appendChild(newCardDiv);
}

function hitCard(user_or_computer) {
    if (user_or_computer == "User") {
        createNewCardDiv("user");

        let [additionalCard, additionalCard_file] = createNewCard();

        displayCard(additionalCard_file, false, "hit-user-card" + number_of_hits_user);
        updateScore(additionalCard, "user");
        user_score_tag.textContent = user_score;

        number_of_hits_user++;
    }

    else if (user_or_computer == "Computer") {
        createNewCardDiv("computer");

        let [additionalCard, additionalCard_file] = createNewCard();

        displayCard(additionalCard_file, false, "hit-computer-card" + number_of_hits_computer);
        updateScore(additionalCard, "computer");
        computer_score_tag.textContent = computer_score;

        number_of_hits_computer++;
    }
}

function announceWinner() {
    if (winner == "Computer") {
        computer_etiquette.textContent = "COMPUTER WINS!";
    }
    else if (winner == "User") {
        user_etiquette.textContent = "USER WINS!";
    }
    else {
        computer_etiquette.textContent = "DRAW";
        user_etiquette.textContent = "DRAW"; 
    }
}

function setUpGame() {
    if (winner == "") {
        setUpComputerDeck();
        setUpUserDeck();
        hitButton();
        standButton();
    }
}

setUpGame();