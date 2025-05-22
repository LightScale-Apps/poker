using System.Data;
using System.Numerics;
using System.Transactions;
using Utils.cs;
using System.Linq;

public class PokerGameService
{
    private List<Player> _players = new();
    private List<int> _deck = new();
    private Random _rng = new Random();
    public int _phase = 0;


    public List<Player> _playersThisGame = new();

    public PokerGameService() => DealCards();
    public List<Player> GetPlayers() => _players;
    public int GetPhase() => _phase++;

    public void AddPlayer(string id, string name)
    {
        _players.RemoveAll(p => p.ConnectionId == id);
        _players.Add(new Player { ConnectionId = id, Username = name });
    }

    public void RemovePlayer(string connectionId)
    {
        _players.RemoveAll(p => p.ConnectionId == connectionId);
    }

    public List<int> Draw(int cards)
    {
        var hand = new List<int>();
        while (hand.Count < cards) {
            hand.Add(_deck[0]);
            _deck.RemoveAt(0);
        }
        return hand;
    }
    public List<Player> DealCards()
    {
        _deck = Enumerable.Range(0, 52).ToList();
        _phase = 0;

        ShuffleDeck();
        ShuffleDeck();
        ShuffleDeck();

	_playersThisGame = _players;		

        foreach (var p in _playersThisGame)
        {
            p.Cards = [_deck[0], _deck[1]];
            _deck.RemoveAt(0);
            _deck.RemoveAt(0);
        }
	return _playersThisGame;
    }
    private void ShuffleDeck() {
        for (int n = _deck.Count - 1; n > 0; n--) {
            int k = _rng.Next(n);

            int temp = _deck[k];
            _deck[k] = _deck[n];
            _deck[n] = temp;
        }
    }
}
