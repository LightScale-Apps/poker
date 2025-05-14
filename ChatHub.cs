using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    public async Task SendMessage(string message)
    {
        await Clients.Caller.SendAsync("ReceiveMessage", "You said: " + message);
    }
}
