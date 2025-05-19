const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();
var statusText = document.getElementById("status");
var phaseText = document.getElementById("phase");
var playerList = document.getElementById("playerList");
var playerNum = document.getElementById("playerNumber");
var tableCards = document.getElementById("tableCards");

connection.on("PlayerList", (allPlayers) => {
  playerList.innerHTML = "";
  for (let playerName of allPlayers) {
    let li = document.createElement("li");
    let txt = document.createTextNode(playerName);
    li.appendChild(txt);
    playerList.appendChild(li);
  }
  playerNum.textContent = allPlayers.length;
});
async function nc() {
  await connection.invoke("NextCard");
}
connection.on("CardsDealt", (cardList) => {
  for (var card of cardList) {
    let li = document.createElement("li");
    let txt = document.createTextNode(card);
    li.appendChild(txt);
    tableCards.appendChild(li);
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
