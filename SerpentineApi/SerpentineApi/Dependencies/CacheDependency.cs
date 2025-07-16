using SerpentineApi.DataAccess.Cache;

namespace SerpentineApi.Dependencies;

public static class CacheDependency
{
    public static IServiceCollection AddCacheServices(this IServiceCollection services)
    {
        services.AddSingleton<ActiveUsersCache>();
        services.AddSingleton<ChannelsActivityCache>();
        return services;
    }
}
