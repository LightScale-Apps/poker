namespace Utils.cs
{
    public class Player
    {
        public string ConnectionId { get; set; } = "";
        public string Username { get; set; } = "";
        public List<int> Cards { get; set; } = new();
        public string GetHand() => $"{Cards[0]},{Cards[1]}";
}

}
