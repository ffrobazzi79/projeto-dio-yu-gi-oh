const PATH_IMAGES = "./src/assets/icons/";

const state = {
    score: {
        player: 0,
        computer: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: {
            id: "player-cards",
            box: document.querySelector("#player-cards"),
        },
        computer: {
            id: "computer-cards",
            box: document.querySelector("#computer-cards"),
        },
    },
    actions: {
        nextDuelButton: document.getElementById("next-duel"),
    },
};

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${PATH_IMAGES}dragon.png`,
        win: [1],
        lose: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${PATH_IMAGES}magician.png`,
        win: [2],
        lose: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${PATH_IMAGES}exodia.png`,
        win: [0],
        lose: [1],
    },
];

async function getRandomCardId() {
    return Math.floor(Math.random() * cardData.length);
}

function createCardElement(cardId, fieldSide) {
    const cardElement = document.createElement("img");
    cardElement.src = `${PATH_IMAGES}card-back.png`;
    cardElement.height = 100;
    cardElement.classList.add("card");
    cardElement.dataset.id = cardId;

    if (fieldSide === state.playerSides.player1.id) {
        cardElement.addEventListener("mouseover", () => updateCardDetails(cardId));
        cardElement.addEventListener("click", () => handleCardSelection(cardId));
    }

    return cardElement;
}

async function handleCardSelection(playerCardId) {
    await clearCards();
    const computerCardId = await getRandomCardId();

    toggleFieldCardsVisibility(true);
    resetCardDetails();

    drawSelectedCards(playerCardId, computerCardId);

    const duelResult = resolveDuel(playerCardId, computerCardId);
    updateScoreDisplay();
    updateDuelButton(duelResult);
}

function drawSelectedCards(playerCardId, computerCardId) {
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

function toggleFieldCardsVisibility(visible) {
    const display = visible ? "block" : "none";
    state.fieldCards.player.style.display = display;
    state.fieldCards.computer.style.display = display;
}

function resetCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.textContent = "";
    state.cardSprites.type.textContent = "";
}

function updateDuelButton(result) {
    const button = state.actions.nextDuelButton;
    button.textContent = result;
    button.style.display = "block";
}

function updateScoreDisplay() {
    state.score.scoreBox.textContent = `Win: ${state.score.player} | Lose: ${state.score.computer}`;
}

function resolveDuel(playerCardId, computerCardId) {
    const playerCard = cardData[playerCardId];
    let result = "DRAW";

    if (playerCard.win.includes(computerCardId)) {
        state.score.player++;
        result = "WIN";
    } else if (playerCard.lose.includes(computerCardId)) {
        state.score.computer++;
        result = "LOSE";
    }

    playAudio(result);
    return result;
}

async function clearCards() {
    ["player1", "computer"].forEach(side => {
        const box = state.playerSides[side].box;
        box.querySelectorAll("img").forEach(img => img.remove());
    });
}

function updateCardDetails(cardId) {
    const card = cardData[cardId];
    state.cardSprites.avatar.src = card.img;
    state.cardSprites.name.textContent = card.name;
    state.cardSprites.type.textContent = `Attribute: ${card.type}`;
}

async function drawCards(count, fieldSide) {
    const fieldBox = document.getElementById(fieldSide);
    for (let i = 0; i < count; i++) {
        const cardId = await getRandomCardId();
        const cardElement = createCardElement(cardId, fieldSide);
        fieldBox.appendChild(cardElement);
    }
}

async function resetDuel() {
    resetCardDetails();
    toggleFieldCardsVisibility(false);
    state.actions.nextDuelButton.style.display = "none";
    init();
}

function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status.toLowerCase()}.wav`);
    audio.volume = 0.1;
    audio.play().catch(() => {});
}

function init() {
    document.getElementById("bgm").volume = 0.2;
    document.getElementById("bgm").play();
    toggleFieldCardsVisibility(false);
    drawCards(5, state.playerSides.player1.id);
    drawCards(5, state.playerSides.computer.id);
}

init();

