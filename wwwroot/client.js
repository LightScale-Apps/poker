const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();
var statusText = document.getElementById("status");
var userText = document.getElementById("username");
var holeCards = document.getElementById("myCards");

connection.on("HoleCards", (res) => {
  holeCards.innerHTML = res;
});
userText.addEventListener("input", () => {
  const username = userText.value.trim();
  if (!username) return;
  connection.invoke("JoinPlayer", username);
});

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
