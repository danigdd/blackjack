'use strict'

const list_of_cards = [
  "AH","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH",
  "AD","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD",
  "AC","2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC",
  "AS","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS"
];

function chooseCard() {
    let card_chosen = list_of_cards[ Math.floor( Math.random() * list_of_cards.length ) ];
    console.log(card_chosen);
    return card_chosen;
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

function setUpComputerDeck() {
    let first_computer_card = chooseCard();
    let first_computer_card_file = getCardFile(first_computer_card);
    displayCard(first_computer_card_file, true, "first-card-computer");

    let second_computer_card = chooseCard();
    let second_computer_card_file = getCardFile(second_computer_card);
    displayCard(second_computer_card_file, false, "second-card-computer");
    return;
}

function setUpGame() {
    setUpComputerDeck();
}

setUpGame();