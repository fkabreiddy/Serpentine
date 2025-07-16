using SerpentineApi.Services.CloudinaryStorage;

namespace SerpentineApi.Dependencies;

public static class CloudinaryDependency
{
    public static IServiceCollection AddCloudinaryServices(this IServiceCollection services)
    {
        services
            .AddOptions<CloudinarySettings>()
            .BindConfiguration("Cloudinary")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddTransient<CloudinaryService>();

        return services;
    }
}
