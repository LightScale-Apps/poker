const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();

//for both
var statusText = document.getElementById("status");
var phaseText = document.getElementById("phase");

//for host
var playerList = document.getElementById("playerList");
var playerNum = document.getElementById("playerNumber");
var tableCards = document.getElementById("tableCards");

var buttonText = document.getElementById("buttonText");

//for client
var playerName = document.getElementById("playerNameText");
var userText = document.getElementById("username");
var holeCards = document.getElementById("myCards");

async function NEXT() {
  await connection.invoke("NextCard");
}

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

function isInGame(name) {}

//for Host
connection.on("PlayerList", (allPlayers) => {
  playerList.innerHTML = "";
  for (let playerName of allPlayers) {
    let div = document.createElement("div");
    div.className = "player-item";
    let status = document.createElement("div");
    status.className = "player-status";
    status.innerHTML = isInGame(playerName);

    let span = document.createElement("span");
    span.className = "player-name";
    span.innerHTML = playerName;

    div.appendChild(status);
    div.appendChild(span);

    playerList.appendChild(div);
  }
  playerNum.textContent = allPlayers.length;
});

//for Host
connection.on("CardsDealt", (cardList) => {
  cardList.forEach((c) => {
    tableCards.appendChild(renderCard(c));
  });
});

CLIENT_CARDS = [];
//for Client
connection.on("Hand", (c) => {
  holeCards.innerHTML = ACE + ACE;

  let c1 = parseInt(c.split(",")[0]);
  let c2 = parseInt(c.split(",")[1]);

  CLIENT_CARDS = [c1, c2];
});

//for Client
function getName() {
  let name = prompt("Enter Username");

  const username = name.trim();
  if (!username) {
    playerName.innerHTML = "Enter Name...";
  } else {
    playerName.innerHTML = username;
    connection.invoke("JoinPlayer", username);
    window.localStorage.setItem("lastName", username);
  }
}

function initName() {
  localName = window.localStorage.getItem("lastName");
  if (localName == undefined) {
    return null;
  } else {
    connection.invoke("JoinPlayer", localName);
    playerName.innerHTML = localName;
  }
}

//for both
connection.on("GamePhase", (p) => {
  switch (parseInt(p)) {
    case 3:
      tableCards.innerHTML = "";
      buttonText.innerText = "Flop \u2192";
      break;
    case 2:
      buttonText.innerText = "Next Hand $$$";
      break;
    case 1:
      buttonText.innerText = "River \u{1F30A}\u{1F30A}\u{1F30A}";
      break;
    case 0:
      buttonText.innerText = "Turn \u2680\u2681\u2682\u2683\u2684\u2685";
      break;
    default:
      break;
  }
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

connection.on("ClearCache", () => {
  window.localStorage.removeItem("lastName");
});

ACE =
  '<div class="card heart spades clubs diamonds" data-value="A"><span class="card-symbol">♦♣♥♠</span></div>';

TOGGLE = true;
document.getElementById("myCards").addEventListener("click", (e) => {
  e.preventDefault();
  holeCards.innerHTML = "";
  TOGGLE = !TOGGLE;
  if (TOGGLE) {
    holeCards.innerHTML += ACE + ACE;
  } else {
    holeCards.appendChild(renderCard(CLIENT_CARDS[0]));
    holeCards.appendChild(renderCard(CLIENT_CARDS[1]));
  }
});
