using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.ObjectPool;
using Utils.cs;
public class PokerHub : Hub
{
    private readonly PokerGameService _gameService;
    public PokerHub(PokerGameService gameService) {
        _gameService = gameService;
    }

    public async Task NextCard()
    {
        var p = _gameService.GetPhase();
        Clients.All.SendAsync("GamePhase", p);
        switch (p)
        {
            case 0:
                await Clients.All.SendAsync("CardsDealt", _gameService.Draw(3));
                break;
            case 1: case 2:
                await Clients.All.SendAsync("CardsDealt", _gameService.Draw(1));
                break;
            default:
                await ResetGame();
                break;
        }
    }

    public async Task ListPlayers()
    {
        var players = _gameService.GetPlayers();
        await Clients.All.SendAsync("PlayerList", players.Select(p => p.Username).ToList());
    }

    public async Task JoinPlayer(string username) {
        _gameService.AddPlayer(Context.ConnectionId, username);
        await ListPlayers();
    }

    public async Task ResetGame() {
        _gameService.DealCards();
        foreach (var player in _gameService.GetPlayers()) {
            await Clients.Client(player.ConnectionId).SendAsync("Hand", player.getHand());
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var players = _gameService.GetPlayers();
        var disconnectedPlayer = players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);

        if (disconnectedPlayer != null)
        {
            _gameService.RemovePlayer(Context.ConnectionId);
            await ListPlayers();
        }

        await base.OnDisconnectedAsync(exception);
    }
}