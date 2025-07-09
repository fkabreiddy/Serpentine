using Microsoft.AspNetCore.SignalR;

namespace SerpentineApi.Hubs;

public class HubExecutor<THub>(ILogger<THub> logger) where THub : Hub
{
    public async Task<HubResult<T>> InvokeAsync<T>(Func<Task<HubResult<T>>> func)
    {
        try
        {
            logger.LogInformation($"Calling hub: {typeof(THub).Name}");
            return await func();
        }
        catch(UnauthorizedAccessException ex)
        {
            logger.LogError($"Unauthorized Access to: {nameof(THub)}");
            return new HubResult<T>(false, "You do not have permission to access this resource.");
        }
        catch (Exception e)
        {
            logger.LogError( e.InnerException?.Message ?? e.Message);
            return new HubResult<T>(false);
        }
    }
    
     public async Task InvokeVoidAsync(Func<Task> func)
    {
        try
        {
            logger.LogInformation($"Calling hub: {typeof(THub).Name}");
            await func();
        }
        catch (Exception e)
        {
            logger.LogError( e.InnerException?.Message ?? e.Message);
            
        }
    }
}