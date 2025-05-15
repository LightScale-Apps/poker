const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();

connection.on("PlayerList", (playerList) => {
  document.getElementById("playerList").textContent = playerList.join(", ");
});

connection.on("CommunityCards", (commCards) => {
  document.getElementById("communityCards").textContent = commCards.join(", ");
});

function dealCards() {
  connection.invoke("StartGame");
}

(async function startConnection() {
  try {
    connection.start();
    console.log("Connected to hub");
    connection.invoke("ListPlayers");
  } catch (err) {
    console.error(err);
    setTimeout(startConnection, 5000);
  }
})();
