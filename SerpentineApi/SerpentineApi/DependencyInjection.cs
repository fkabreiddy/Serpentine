using SerpentineApi.Dependencies;

namespace SerpentineApi;

public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(
        this IServiceCollection services,
        WebApplicationBuilder builder
    )
    {
        services.AddCloudinaryServices();
        services.AddDbContextServices(builder.Configuration);
        services.AddJwtServices(builder.Configuration);
        services.AddEndpointsDependencies();

        return services;
    }
}
