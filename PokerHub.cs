using Microsoft.AspNetCore.SignalR;
public class PokerHub : Hub
{
    private readonly PokerGameService _gameService;
    private readonly ILogger<PokerHub> _logger;

    public PokerHub(PokerGameService gameService, ILogger<PokerHub> logger)
    {
        _gameService = gameService;
        _logger = logger;
    }

    public async Task JoinPlayer(string username)
    {
        var existingPlayer = await Context.FirstOrDefault((p) => p.ConnectionId == Context.ConnectionId);
        if (existingPlayer != null) await _gameService.RemovePlayer(Context.ConnectionId);


        _gameService.AddPlayer(Context.ConnectionId, username);
        await SendPlayerList();
    }

    public async Task DealCards()
    {
        _gameService.DealCards();

        // Send individual cards to each player
        foreach (var player in _gameService.GetPlayers())
        {
            await Clients.Client(player.ConnectionId).SendAsync("ReceiveCards", player.Cards);
        }

        await Clients.All.SendAsync("GameStarted");
    }

    public async Task NextCards()
    {
        if (!_gameService.IsGameInProgress())
        {
            await DealCards();
            return;
        }

        var newCards = _gameService.DealNextCommunityCards();
        if (newCards.Any())
        {
            await Clients.All.SendAsync("NewCommunityCards", newCards);
        }
        else
        {
            // If no new cards were dealt, the round is over
            await Clients.All.SendAsync("RoundEnded");
        }
    }

    public async Task ListPlayers()
    {
        await SendPlayerList();
    }

    private async Task SendPlayerList()
    {
        var players = _gameService.GetPlayers();
        await Clients.All.SendAsync("PlayerList", players.Select(p => p.Username).ToList());
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var players = _gameService.GetPlayers();
        var disconnectedPlayer = players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
        
        if (disconnectedPlayer != null)
        {
            _gameService.RemovePlayer(Context.ConnectionId);
            await Clients.All.SendAsync("PlayerLeft", disconnectedPlayer.Username);
            await SendPlayerList();
        }

        await base.OnDisconnectedAsync(exception);
    }
}