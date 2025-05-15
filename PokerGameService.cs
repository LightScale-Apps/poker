public class Card {
    public string Suit { get; set; } = "";
    public string Value { get; set; } = "";
}
public class Player {
    public string ConnectionId { get; set; } = "";
    public string Username { get; set; } = "";
    public List<Card> Cards { get; set; } = new();
}
public class PokerGameService {
    private List<Player> _players = new();
    private List<Card> _deck = new();
    private List<Card> _communityCards = new();
    private Random _random = new();

    public PokerGameService() => InitializeDeck();
    private void InitializeDeck() {
        _deck.Clear();
        var values = new[] { "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A" };
        foreach (var value in values) {
            _deck.Add(new Card { Suit = "H", Value = value });
            _deck.Add(new Card { Suit = "D", Value = value });
            _deck.Add(new Card { Suit = "C", Value = value });
            _deck.Add(new Card { Suit = "S", Value = value });
        }
    }

    public void AddPlayer(string id, string name) {
        _players.RemoveAll(p => p.ConnectionId == id);
        _players.Add(new Player { ConnectionId = id, Username = name });
    }

    public void RemovePlayer(string connectionId) {
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

    public void ResetGame() {
        InitializeDeck();
        _communityCards.Clear();
        foreach (var player in _players) player.Cards.Clear();
    }

    public void DealCards() {
        ResetGame();
        ShuffleDeck(10);

        foreach (var p in _players) p.Cards = Draw(2);
        _communityCards = Draw(5); 
    }
    private void ShuffleDeck(int iterations) {
        int _i = 0;
        while (_i < iterations) {
            for (int n = _deck.Count - 1; n > 0; n--) {
                int k = _random.Next(n); 
                //pick random index k between 0 and n
                
                Card temp = _deck[k];
                _deck[k] = _deck[n];
                _deck[n] = temp;
                //swap the card at k and n
            }
            _i++;
        }
    }
}
