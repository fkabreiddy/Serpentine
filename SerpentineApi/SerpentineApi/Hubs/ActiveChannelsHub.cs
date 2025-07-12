using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SerpentineApi.DataAccess.Cache;

namespace SerpentineApi.Hubs;

public sealed class ActiveChannelsHub(ChannelsActivityCache cache, HubExecutor<ActiveChannelsHub> executor) : Hub<IActiveChannelsHub>
{
    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await executor.InvokeVoidAsync(async () =>
        {

            var userId = Context.UserIdentifier ?? throw new UnauthorizedAccessException();

            cache.LeaveAllChannels(userId);
            await Task.CompletedTask;

        });
    }

    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public async Task ConnectToChannel(string channelId)
    {
        await executor.InvokeVoidAsync(async () =>
        {

            var userId = Context.UserIdentifier ?? throw new UnauthorizedAccessException();
            await Clients.User(userId).UserConnectedToChannels(new HubResult<bool>(cache.AddChannel(channelId, userId)));

        });
    }
}

public interface IActiveChannelsHub
{
    public  Task UserDisconnected(HubResult<string> userId);
    public Task UserConnectedToChannels(HubResult<bool> result);
    
}
