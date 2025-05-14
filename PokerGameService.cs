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

    public void AddPlayer(string connectionId, string username) {
        var repeatPlayer = _players.Any(p => p.ConnectionId == connectionId);

        if (repeatPlayer) _players.RemoveAll(p => p.ConnectionId == connectionId);
        
        _players.Add(new Player { ConnectionId = connectionId, Username = username });
    }

    public void RemovePlayer(string connectionId)
    {
        _players.RemoveAll(p => p.ConnectionId == connectionId);
    }

    public List<Player> GetPlayers() => _players;

    private List<Card> Draw(int cards) {
        int i = cards;
        var hand = new List<Card>();
        while (i > 0) {
            hand.Add(_deck[0]);
            _deck.RemoveAt(0);
            i -= 1;
        }
        return hand;
    }

    public void DealCards() {
        // Reset the game state
        InitializeDeck();
        _communityCards.Clear();
        foreach (var player in _players) {
            player.Cards.Clear();
        }
        // Shuffle deck
        ShuffleDeck();

        // Deal 2 cards to each player
        foreach (var player in _players) {
            player.Cards = Draw(2);
        }

        _communityCards.Add(Draw(5));
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
