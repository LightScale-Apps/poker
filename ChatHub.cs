using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    public async Task SendMessage(string message) {
        await Clients.All.SendAsync("ReceiveMessage", "You said: " + message);
    }

    public async Task CreateLobby(string lobby) {
        await Clients.All.SendAsync("LobbyCreated", "Join Code: " + lobby);
    }
}
