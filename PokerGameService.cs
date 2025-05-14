public class PokerGameService
{
    private readonly List<Player> _players = new();
    private readonly List<Card> _deck = new();
    private readonly List<Card> _communityCards = new();
    private readonly Random _random = new();

    public PokerGameService()
    {
        InitializeDeck();
    }

    private void InitializeDeck()
    {
        _deck.Clear();
        var suits = new[] { "Hearts", "Diamonds", "Clubs", "Spades" };
        var values = new[] { "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A" };

        foreach (var suit in suits)
        {
            foreach (var value in values)
            {
                _deck.Add(new Card { Suit = suit, Value = value });
            }
        }
    }

    public void AddPlayer(string connectionId, string username)
    {
        if (!_players.Any(p => p.Username == username))
        {
            _players.Add(new Player { ConnectionId = connectionId, Username = username });
        }
    }

    public void RemovePlayer(string connectionId)
    {
        _players.RemoveAll(p => p.ConnectionId == connectionId);
    }

    public List<Player> GetPlayers() => _players;

    public void DealCards()
    {
        // Reset the game state
        InitializeDeck();
        _communityCards.Clear();
        foreach (var player in _players)
        {
            player.Cards.Clear();
        }

        // Shuffle deck
        ShuffleDeck();

        // Deal 2 cards to each player
        foreach (var player in _players)
        {
            for (int i = 0; i < 2; i++)
            {
                var card = _deck[0];
                _deck.RemoveAt(0);
                player.Cards.Add(card);
            }
        }
    }

    public List<Card> DealNextCommunityCards()
    {
        List<Card> newCards = new();

        // Flop (first 3 cards)
        if (_communityCards.Count == 0)
        {
            for (int i = 0; i < 3; i++)
            {
                var card = _deck[0];
                _deck.RemoveAt(0);
                _communityCards.Add(card);
                newCards.Add(card);
            }
        }
        // Turn or River (1 card each)
        else if (_communityCards.Count < 5)
        {
            var card = _deck[0];
            _deck.RemoveAt(0);
            _communityCards.Add(card);
            newCards.Add(card);
        }

        return newCards;
    }

    private void ShuffleDeck()
    {
        int n = _deck.Count;
        while (n > 1)
        {
            n--;
            int k = _random.Next(n + 1);
            Card temp = _deck[k];
            _deck[k] = _deck[n];
            _deck[n] = temp;
        }
    }

    public bool IsGameInProgress() => _communityCards.Any() || _players.Any(p => p.Cards.Any());
    public List<Card> GetCommunityCards() => _communityCards;
}