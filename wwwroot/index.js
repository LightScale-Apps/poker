var CARD_DECK = [];
for (val of [
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
]) {
  CARD_DECK.push(
    [{ full: "clubs", symbol: "♣" }, val],
    [{ full: "diamonds", symbol: "♦" }, val],
    [{ full: "hearts", symbol: "♥" }, val],
    [{ full: "spades", symbol: "♠" }, val]
  );
}

function renderCard(number) {
  const [suit, value] = CARD_DECK[number];

  let card = document.createElement("div");
  card.className = "card " + suit.full;
  card.setAttribute("data-value", value);

  let cardSymbol = document.createElement("span");
  cardSymbol.className = "card-symbol";
  cardSymbol.innerHTML = suit.symbol;

  card.appendChild(cardSymbol);

  return card;
}

async function INITIALIZE_HOST(srConnection) {
  var _playerList = document.getElementById("playerList");
  var _tableCards = document.getElementById("tableCards");
  var _buttonText = document.getElementById("buttonText");

  srConnection.on("PlayerList", (allPlayers) => {
    _playerList.innerHTML = "";
    for (let p of allPlayers) {
      let div = document.createElement("div");
      div.className = "player-item";

      let status = document.createElement("div");
      status.className = "player-status";

      let span = document.createElement("span");
      span.className = "player-name";

      span.innerHTML = p;

      div.appendChild(status);
      div.appendChild(span);

      _playerList.appendChild(div);
    }
  });

  srConnection.on("CardsDealt", (cardList) => {
    cardList.forEach((c) => {
      _tableCards.appendChild(renderCard(c));
    });
  });

  srConnection.on("GamePhase", (phase) => {
    switch (parseInt(phase)) {
      case 3: //Reset the Game
        _tableCards.innerHTML = "";
        buttonText.innerText = "Flop \u2192";
        break;
      case 2: //SHow the river
        buttonText.innerText = "Next Hand $$$";
        break;
      case 1: //Show the turn
        buttonText.innerText = "River \u{1F30A}\u{1F30A}\u{1F30A}";
        break;
      case 0: //show the flop
        buttonText.innerText = "Turn \u2680\u2681\u2682\u2683\u2684\u2685";
        break;
      default:
        break;
    }
  });

  _buttonText.addEventListener("click", () => {
    srConnection.invoke("NextCard");
  });
}

async function INITIALIZE_CLIENT(srConnection) {
  TOGGLE = true;
  ACE =
    '<div class="card heart spades clubs diamonds" data-value="A"><span class="card-symbol">♦♣♥♠</span></div>';
  CLIENT_CARDS = [];
  var _playerName = document.getElementById("nameText");
  var _holeCards = document.getElementById("myCards");

  let fromLocalStorage = window.localStorage.getItem("lastName");
  if (fromLocalStorage != undefined) {
    srConnection.invoke("JoinPlayer", fromLocalStorage);
    _playerName.innerHTML = fromLocalStorage;
  }

  srConnection.on("Hand", (handCards) => {
    _holeCards.innerHTML = ACE + ACE;
    CLIENT_CARDS = handCards.split(",");
  });

  _holeCards.addEventListener("click", (e) => {
    e.preventDefault();
    _holeCards.innerHTML = "";
    TOGGLE = !TOGGLE;
    if (TOGGLE) {
      _holeCards.innerHTML += ACE + ACE;
    } else {
      _holeCards.appendChild(renderCard(parseInt(CLIENT_CARDS[0])));
      _holeCards.appendChild(renderCard(parseInt(CLIENT_CARDS[1])));
    }
  });

  document.getElementById("nameButton").addEventListener("click", () => {
    let name = prompt("Enter Username").trim();

    if (!name) {
      _playerName.innerText = "Enter Name...";
    } else {
      _playerName.innerText = name;
      srConnection.invoke("JoinPlayer", name);
      window.localStorage.setItem("lastName", name);
    }
  });
}

async function CONNECT(srConnection, initFunction) {
  let _statusText = document.getElementById("status");
  try {
    await srConnection.start();
    _statusText.innerHTML = srConnection.state;
    if (srConnection.state == "Connected") {
      initFunction(srConnection);
    }
  } catch (err) {
    _statusText.innerHTML = err + " | Trying again...";
    setTimeout(CONNECT, 5000, srConnection, initFunction);
  }
}
