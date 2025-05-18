namespace Utils.cs
{
public class Card {
    public string Suit { get; set; } = "";
    public string Value { get; set; } = "";

    public override string ToString()
    {
        return this.Value + this.Suit;
    }
}
    public class Player
    {
        public string ConnectionId { get; set; } = "";
        public string Username { get; set; } = "";
        public List<Card> Cards { get; set; } = new();
        public string getHand() => string.Join(" ", Cards);
}

}
