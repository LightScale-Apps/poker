using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{

    public string playerList = "";
    public int playerCount = 0;

    public async Task JoinPlayer(string name) {
        playerList += ", " + name;
        playerCount += 1;
        await Clients.All.SendAsync("PlayerList", playerCount + " Players: " + playerList);
    }

    public async Task JoinRoom(string playerName) {
        await Groups.AddToGroupAsync(Context.ConnectionId, "game");
    }

    public async Task MyName() {
        await Clients.Caller.SendAsync("Name", Clients.Caller.playerName);
    }


    //clients:
    //display cards when given by server

    //host:
    //during river figure out who the players are
    //once hole cards are dealt, those players are locked in for that hand (no one else can join)
    //shuffle/deal cards and send out to players

}
