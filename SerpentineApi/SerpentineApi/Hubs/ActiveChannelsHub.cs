using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SerpentineApi.DataAccess.Cache;

namespace SerpentineApi.Hubs;

public sealed class ActiveChannelsHub(
    ChannelsActivityCache cache,
    HubExecutor<ActiveChannelsHub> executor,
    ILogger<ActiveChannelsHub> logger
) : Hub<IActiveChannelsHub>
{
    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await executor.InvokeVoidAsync(async () =>
        {
            var userId = Context.UserIdentifier ?? throw new UnauthorizedAccessException();
            logger.LogInformation($"diconnecting {userId} from active channels hub");

            cache.LeaveAllChannels(userId);
            await Task.CompletedTask;
        });
    }

    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public async Task<HubResult<bool>> ConnectToChannel(string channelId)
    {
        return await executor.InvokeAsync<bool>(async () =>
        {
            var userId = Context.UserIdentifier ?? throw new UnauthorizedAccessException();
            var added = cache.AddChannel(channelId, userId);

            if (added)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, channelId);
                return new HubResult<bool>(true);
            }

            return new HubResult<bool>(
                succeeded: false,
                "Could not connect to the channel. Try again later"
            );
        });
    }

    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public async Task<HubResult<bool>> DisconnectFromChannel(string channelId)
    {
        return await executor.InvokeAsync<bool>(async () =>
        {
            var userId = Context.UserIdentifier ?? throw new UnauthorizedAccessException();
            var removed = cache.RemoveUser(channelId, userId);

            if (removed)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId);
                return new HubResult<bool>(true);
            }

            return new HubResult<bool>(
                succeeded: false,
                "Could not disconnect to the channel. Try again later"
            );
        });
    }
}

public interface IActiveChannelsHub
{
    public Task UserDisconnected(HubResult<string> userId);
}
