const connection = new signalR.HubConnectionBuilder()
  .withUrl("/pokerhub")
  .withAutomaticReconnect()
  .build();

connection.on("HoleCards", (res) => {
  document.getElementById("myCards").innerHTML = res;
});
document.getElementById("username").addEventListener("input", () => {
  const username = document.getElementById("username").value.trim();
  if (!username) return;
  connection.invoke("JoinPlayer", username);
});

(async function startConnection() {
  try {
    await connection.start();
    console.log("Connected to hub");
  } catch (err) {
    console.error(err);
    setTimeout(startConnection, 5000);
  }
})();
