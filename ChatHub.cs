using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{

    public string playerList = "";
    public int playerCount = 0;
    public async Task SendMessage(string message) {
        await Clients.All.SendAsync("ReceiveMessage", "You said: " + message);
    }

    public async Task JoinPlayer(string name) {
        playerList += ", " + name;
        playerCount += 1;

        await Clients.All.SendAsync("PlayerList", playerCount + " Players: " + playerList);
    }

    public async Task CreateLobby(string lobby) {
        await Clients.All.SendAsync("LobbyCreated", "Join Code: " + lobby);
    }

    public async Task FindPlayers() {
        await Clients.Caller.SendAsync("PlayerList", playerCount + " Players: " + playerList);
    }

    //clients:
    //logon and provide a name
    //receive cards and display

    //host:
    //count all the players and list them
    //deal and shuffle cards
    //win detection
    //determine dealer

}
