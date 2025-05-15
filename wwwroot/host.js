const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();
var statusText = document.getElementById("status");

connection.on("PlayerList", (playerList) => {
  for (let playerName of playerList) {
    let li = document.createElement("li");
    let txt = document.createTextNode(playerName);
    li.appendChild(txt);
    document.getElementById("playerList").appendChild(li);
  }
  document.getElementById("playerNumber").textContent = playerList.length;
});

connection.on("CommunityCards", (commCards) => {
  document.getElementById("communityCards").textContent = commCards.join(", ");
});

function START() {
  connection.invoke("StartGame");
}
async function CONNECT() {
  try {
    await connection.start();
    statusText.innerHTML = connection.state;
  } catch (err) {
    statusText.innerHTML = err + " | Trying again...";
    setTimeout(startConnection, 5000);
  }
}
CONNECT();
