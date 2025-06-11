using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace SerpentineApi.Dependencies;

public static class DbContextDependency
{
    public static IServiceCollection AddDbContextServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SerpentineDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("MSSQL"));
            options.ConfigureWarnings(warning =>
                warning.Ignore(RelationalEventId.PendingModelChangesWarning)
            );
        });
        

        return services;

    }
}