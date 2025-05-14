using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
public class Card {
    public string Suit { get; set; } = "";
    public string Value { get; set; } = "";

    public override string ToString()
    {
        return $"{Value} of {Suit}";
    }
}

public class Player {
    public string ConnectionId { get; set; } = "";
    public string Username { get; set; } = "";
    public List<Card> Cards { get; set; } = new();
}