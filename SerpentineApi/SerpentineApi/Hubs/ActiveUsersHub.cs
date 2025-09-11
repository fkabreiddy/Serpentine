using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SerpentineApi.DataAccess.Cache;

namespace SerpentineApi.Hubs;

public sealed class ActiveUsersHub(
    ActiveUsersCache cache,
    ILogger<ActiveUsersHub> logger,
    HubExecutor<ActiveUsersHub> executor
) : Hub<IActiveUsersHub>
{
    [Authorize(JwtBearerDefaults.AuthenticationScheme)]
    public override async Task OnConnectedAsync()
    {
        await executor.InvokeVoidAsync(async () =>
        {
            var userId = Context.UserIdentifier ?? throw new UnauthorizedAccessException();
            if (cache.AddUser(userId, Context.ConnectionId))
            {
                await Clients.All.SendUserConnected(new HubResult<string>(userId));
            }
            else
            {
                cache.RemoveUser(userId);
                cache.AddUser(userId, Context.ConnectionId);
                await Clients.All.SendUserConnected(new HubResult<string>(userId));
            }
            logger.LogInformation(
                $"[{typeof(ActiveUsersHub).Name}] User with Id: {userId} connected. Connection Id: {Context.ConnectionId}"
            );
        });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await executor.InvokeVoidAsync(async () =>
        {
            var userId = Context.UserIdentifier ?? throw new UnauthorizedAccessException();
            if (cache.RemoveUser(userId))
                await Clients.All.SendUserDisconnected(new HubResult<string>(userId));

            logger.LogInformation(
                $"[{typeof(ActiveUsersHub).Name}] User with Id: {userId} and Connection Id: {Context.ConnectionId} was disconnected."
            );
        });
    }
}

public interface IActiveUsersHub
{
    Task SendUserConnected(HubResult<string> result);
    Task SendUserDisconnected(HubResult<string> result);
}
