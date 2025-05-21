const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();
var statusText = document.getElementById("status");
var playerName = document.getElementById("playerNameText");
var userText = document.getElementById("username");
var holeCards = document.getElementById("ccc");

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

connection.on("Hand", (c) => {
  alert(c);
  holeCards.innerHTML = "";

  let c1 = parseInt(c.split(",")[0]);
  let c2 = parseInt(c.split(",")[1]);
  holeCards.appendChild(renderCard(c1));
  holeCards.appendChild(renderCard(c2));
});

function getName() {
  let name = prompt("Enter Username");

  const username = name.trim();
  if (!username) {
    playerName.innerHTML = "Enter Name...";
  } else {
    playerName.innerHTML = username;
    connection.invoke("JoinPlayer", username);
  }
}

phaseText = document.getElementById("phase");
connection.on("GamePhase", (p) => {
  phaseText.innerText = p;
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
