const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();
var statusText = document.getElementById("status");
var playerList = document.getElementById("playerList");
var playerNum = document.getElementById("playerNumber");
var table = document.getElementById("communityCards");

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

connection.on("CardsDealt", (cardList) => {
  for (var card of cardList) {
    table.textContent += card;
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
