using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
public class PokerHub : Hub
{
    private readonly PokerGameService _gameService;
    private readonly ILogger<PokerHub> _logger;

    public PokerHub(PokerGameService gameService, ILogger<PokerHub> logger) {
        _gameService = gameService; _logger = logger;
    }

    public async Task ListPlayers() {
        var players = _gameService.GetPlayers();
        await Clients.All.SendAsync("PlayerList", players.Select(p => p.Username).ToList());
    }

    public async Task JoinPlayer(string username) {
        _gameService.AddPlayer(Context.ConnectionId, username);
        await ListPlayers();
    }

    public async Task StartGame() {
        _gameService.DealCards();
        var allPlayers = _gameService.GetPlayers();
        foreach (var p in allPlayers) {
            var cardString = " " + c.Value + c.Suit + " ";
            await Clients.Client(p.ConnectionId).SendAsync("HoleCards", cardString);
        }
        await Clients.Caller.SendAsync("CommunityCards", _gameService.GetCommunityCards());
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var players = _gameService.GetPlayers();
        var disconnectedPlayer = players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
        
        if (disconnectedPlayer != null) {
            _gameService.RemovePlayer(Context.ConnectionId);
            await ListPlayers();
        }

        await base.OnDisconnectedAsync(exception);
    }
}