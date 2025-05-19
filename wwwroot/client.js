const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();
var statusText = document.getElementById("status");
var userText = document.getElementById("username");
var holeCards = document.getElementById("myCards");

connection.on("Hand", (res) => {
  holeCards.innerHTML = res;
});
userText.addEventListener("input", () => {
  const username = userText.value.trim();
  if (!username) return;
  connection.invoke("JoinPlayer", username);
});
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
