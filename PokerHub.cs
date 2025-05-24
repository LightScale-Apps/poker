using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
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
        await Clients.All.SendAsync("GamePhase", p);
        switch (p)
        {
            case 0:
                await Clients.All.SendAsync("CardsDealt", _gameService.Draw(3));
                break;
            case 1:
            case 2:
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

    public async Task UpdateHost()
    {
        var Host = Clients.Caller;
        var players = _gameService.GetPlayers();

        await Host.SendAsync("PlayerList", players.Select(p => p.Username).ToList());
        await Host.SendAsync("GamePhase", _gameService.CurrentPhase());
        await Host.SendAsync("CardsDealt", _gameService.DealtCards());
    }

    public async Task ResetGame()
    {
        _gameService.RemovePlayer(Context.ConnectionId);

        foreach (var player in _gameService.DealCards())
        {
            await Clients.Client(player.ConnectionId).SendAsync("Hand", player.GetHand());
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
