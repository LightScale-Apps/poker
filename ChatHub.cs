using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    public async Task SendMessage(string message) {
        await Clients.All.SendAsync("ReceiveMessage", "You said: " + message);
    }

    public async Task CreateLobby(string lobby) {
        await Clients.All.SendAsync("LobbyCreated", "Join Code: " + lobby);
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
