using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace SerpentineApi.Dependencies;

public static class HealthCheckDependency
{
    public static IServiceCollection AddHealtCheckDependencies(
        this IServiceCollection services,
        IConfiguration configuration
   
    )
    {
        services.AddHealthChecks()
            .AddCheck<SerpentineHealthCheck>(nameof(SerpentineHealthCheck));
        
        services.AddHealthChecks().AddSqlServer(configuration.GetConnectionString("MSSQL") ?? throw  new ArgumentNullException(nameof(configuration)), name: "serpentine-db", failureStatus: HealthStatus.Unhealthy);
        
        
        return services;
    }
     
}

public class SerpentineHealthCheck : IHealthCheck
{
    
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var isHealthy = true;

        if (isHealthy)
        {
            return await Task.FromResult(
                HealthCheckResult.Healthy("Serpentine is healthy"));
        }

        return await Task.FromResult(
            new HealthCheckResult(
                context.Registration.FailureStatus, "Serpentine is unhealthy"));
    }
}

public static class HealtCheckActions
{
    
    public static Task WriteResponse(HttpContext context, HealthReport healthReport)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode =  200 ;

        return context.Response.WriteAsJsonAsync(new SuccessApiResult<string>( healthReport.Status.ToString(), "Total duration: " + healthReport.TotalDuration.ToString(), healthReport.Status == HealthStatus.Healthy));
    }
}