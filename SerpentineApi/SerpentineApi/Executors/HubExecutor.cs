using Microsoft.AspNetCore.SignalR;

namespace SerpentineApi.Hubs;

public class HubExecutor<THub>(ILogger<THub> logger)
    where THub : Hub
{
    public async Task<HubResult<T>> InvokeAsync<T>(Func<Task<HubResult<T>>> func)
    {
        try
        {
            logger.LogInformation($"[{typeof(THub).Name}] A call was made to this hub...");
            return await func();
        }
        catch (UnauthorizedAccessException )
        {
            logger.LogCritical($"[{typeof(THub).Name}] An unauthorized access was requested to this hub.");
            return new HubResult<T>(false, "You do not have permission to access this resource.");
        }
        catch (Exception e)
        {
            logger.LogCritical($"[{typeof(THub).Name}] an exception has occurred: " + e.InnerException?.Message ?? e.Message);
            return new HubResult<T>(false);
        }
    }

    public async Task InvokeVoidAsync(Func<Task> func)
    {
        try
        {
            logger.LogInformation($"[{typeof(THub).Name}] A call was made to this hub...");
            await func();
        }
        catch (Exception e)
        {
            logger.LogCritical($"[{typeof(THub).Name}] an exception has occurred: " + e.InnerException?.Message ?? e.Message);
        }
    }
}
