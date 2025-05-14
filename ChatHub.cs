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

    public async Task JoinRoom() {
        Context.Items.Add("name", "ryanb");
        await Clients.Caller.SendAsync("Response", Context.Items["name"]);
    }


    //clients:
    //display cards when given by server

    //host:
    //during river figure out who the players are
    //once hole cards are dealt, those players are locked in for that hand (no one else can join)
    //shuffle/deal cards and send out to players

}
