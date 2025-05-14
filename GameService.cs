public interface IGameService
{
    void AddMessage(string message);
    List<string> GetHistory();
}

public class GameService : IGameService {
    private readonly List<string> _history = new List<string>();

    public void AddMessage(string message)
    {
        _history.Add(message);
    }

    public List<string> GetHistory()
    {
        return _history;
    }
}