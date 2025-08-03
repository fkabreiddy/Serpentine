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
            logger.LogInformation($"Diconnecting user with Id: {userId} from {typeof(ActiveChannelsHub).Name}");

            cache.LeaveAllChannels(userId);
            await Task.CompletedTask;
        });
    }

    
    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public async Task<HubResult<int>> GetActiveUsersOnAChannelById(string channelId)
    {
        return await executor.InvokeAsync<int>(async () =>
        {


            var amount = cache.GetUsersCountOnAChannel(channelId);
            await Task.CompletedTask;
            return new HubResult<int>(amount);
            
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
                logger.LogInformation($"[{typeof(ActiveChannelsHub).Name}] User with Id: {userId} was added to channel {channelId}");
                await Groups.AddToGroupAsync(Context.ConnectionId, channelId);
                return new HubResult<bool>(true);
            }

            logger.LogWarning($"[{typeof(ActiveChannelsHub).Name}] Could not connect user with Id: {userId} to the channel {channelId}");

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
                logger.LogInformation($"[{typeof(ActiveChannelsHub).Name}] User with Id: {userId} was removed from channel {channelId}");
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId);
                return new HubResult<bool>(true);
            }

            logger.LogWarning($"[{typeof(ActiveChannelsHub).Name}] Could not disconnect user with Id: {userId} from the channel {channelId}. This may result in errors but may be solved on reconection.");
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
    public Task SendUserBanned(HubResult<ChannelBanResponse> channelBan);
    public Task SendChannelRemoved(HubResult<string> channelId);


}
