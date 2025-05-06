using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SerpentineApi.DataAccess.Context;

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
        services.AddScoped(typeof(DbContextAccessor<>));

        return services;

    }
}