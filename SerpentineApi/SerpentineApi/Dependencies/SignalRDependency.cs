using SerpentineApi.Hubs;

namespace SerpentineApi.Dependencies;

public static class SignalRDependency
{
    public static IServiceCollection AddSignalRServices(
        this IServiceCollection services)
    {
        services.AddTransient(typeof(HubExecutor<>));
        services.AddSignalR();
        
        
        return services;
    }
    
    
}