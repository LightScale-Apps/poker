const suits = {
  S: { symbol: "♠", color: "black", name: "spades" },
  H: { symbol: "♥", color: "red", name: "hearts" },
  D: { symbol: "♦", color: "red", name: "diamonds" },
  C: { symbol: "♣", color: "black", name: "clubs" },
};

const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
let deck = [];
function createDeck() {
  for (v in values) {
    deck.push({ value: v, suit: "S" });
    deck.push({ value: v, suit: "H" });
    deck.push({ value: v, suit: "D" });
    deck.push({ value: v, suit: "C" });
  }
}
createDeck();

let communityCards = [];
let players = [];
let currentPhase = 0;

function createCard(value, suitString) {
  let suit = suits[suitString].symbol;

  const card = document.createElement("div");
  card.className = "playing-card";

  const inner = document.createElement("div");
  inner.className = "playing-card-inner";

  const front = document.createElement("div");
  front.className = `card-face card-front ${suits[suitString].color}`;

  // Add corners
  const topLeftCorner = document.createElement("div");
  topLeftCorner.className = "card-corner top-left";
  topLeftCorner.innerHTML = `
        <div class="corner-value">${value}</div>
        <div class="corner-suit">${suit}</div>
    `;

  const bottomRightCorner = document.createElement("div");
  bottomRightCorner.className = "card-corner bottom-right";
  bottomRightCorner.innerHTML = `
        <div class="corner-value">${value}</div>
        <div class="corner-suit">${suit}</div>
    `;

  // Add center suit
  const centerSuit = document.createElement("div");
  centerSuit.className = "card-suit";
  centerSuit.textContent = suit;

  front.appendChild(topLeftCorner);
  front.appendChild(bottomRightCorner);
  front.appendChild(centerSuit);

  const back = document.createElement("div");
  back.className = "card-face card-back";

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  return card;
}

function shuffle(iterations) {
  for (let _ = iterations; _ > 0; _--) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
}

function cardToString(card) {
  return `${card.value}${suits[card.suit].symbol}`;
}

function displayPlayerHands() {
  console.log("Current hands:");
  players.forEach((player, i) => {
    console.log(`Player ${i + 1}: ${player.cards.map(cardToString).join(" ")}`);
  });
}

function setPlayers() {
  const count = parseInt(document.getElementById("playerCount").value);
  if (count < 2 || count > 12) {
    alert("Please enter a number between 2 and 8");
    return;
  }
  players = Array(count)
    .fill()
    .map(() => ({ cards: [] }));
  deal();
}

function deal() {
  createDeck();
  shuffle(7);
  communityCards = [];
  currentPhase = 0;

  document.getElementById("communityCards").innerHTML = "";

  players.forEach((player) => {
    player.cards = [deck.pop(), deck.pop()];
  });

  displayPlayerHands();

  gsap.from("#playerInfo div", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out",
  });
}

function nextCard() {
  if (currentPhase === 0) {
    for (let i = 0; i < 3; i++) {
      communityCards.push(deck.pop());
    }
    currentPhase = 1;
  } else if (currentPhase < 3) {
    communityCards.push(deck.pop());
    currentPhase++;
  } else {
    deal();
    return;
  }

  const communityContainer = document.getElementById("communityCards");
  communityContainer.innerHTML = "";

  communityCards.forEach((card, index) => {
    const cardElement = createCard(card.value, card.suit);
    cardElement.style.animationDelay = `${index * 0.1}s`;
    communityContainer.appendChild(cardElement);
  });

  gsap.from(".playing-card", {
    y: -50,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)",
  });

  console.log("Community cards:", communityCards.map(cardToString).join(" "));
}

setPlayers();
