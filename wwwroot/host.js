const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();
var statusText = document.getElementById("status");
var phaseText = document.getElementById("phase");
var playerList = document.getElementById("playerList");
var playerNum = document.getElementById("playerNumber");
var tableCards = document.getElementById("tableCards");

async function NEXT() {
  await connection.invoke("NextCard");
}

connection.on("PlayerList", (allPlayers) => {
  playerList.innerHTML = "";
  for (let playerName of allPlayers) {
    let div = document.createElement("div");
    div.className = "player-item";
    let status = document.createElement("div");
    status.className = "player-status";

    let span = document.createElement("span");
    span.className = "player-name";
    span.innerHTML = playerName;

    div.appendChild(status);
    div.appendChild(span);

    playerList.appendChild(div);
  }
  playerNum.textContent = allPlayers.length;
});
connection.on("CardsDealt", (cardList) => {
  alert(cardList);
  for (var card of cardList.split(",")) {
    tableCards.appendChild(renderCard(card));
  }
});

connection.on("GamePhase", (p) => {
  phaseText.innerText = p;
  if (p == 3) tableCards.innerHTML = "";
});
async function CONNECT() {
  try {
    await connection.start();
    statusText.innerHTML = connection.state;
  } catch (err) {
    statusText.innerHTML = err + " | Trying again...";
    setTimeout(CONNECT, 5000);
  }
}
CONNECT();

var SUITS = [
  {
    full: "clubs",
    symbol: "♣",
  },
  {
    full: "diamonds",
    symbol: "♦",
  },
  {
    full: "hearts",
    symbol: "♥",
  },
  {
    full: "spades",
    symbol: "♠",
  },
];

var CARD = [];

for (let i = 0; i < 13; i++) {
  let val;

  switch (i) {
    case 12:
      val = "A";
      break;
    case 11:
      val = "K";
      break;
    case 10:
      val = "Q";
      break;
    case 9:
      val = "J";
      break;
    default:
      val = i + 2;
      break;
  }
  CARD.push([SUITS[0], val], [SUITS[1], val], [SUITS[2], val], [SUITS[3], val]);
}

function renderCard(number) {
  const [suit, value] = CARD[number];

  let card = document.createElement("div");
  card.className = "card " + suit.full;
  card.setAttribute("data-value", value);

  let cardSymbol = document.createElement("span");
  cardSymbol.className = "card-symbol";
  cardSymbol.innerHTML = suit.symbol;

  card.appendChild(cardSymbol);

  return card;
}
