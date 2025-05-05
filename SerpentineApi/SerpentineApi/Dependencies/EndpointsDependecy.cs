using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SerpentineApi.Executors;
using SerpentineApi.Features;

namespace SerpentineApi.Dependencies;

public static class EndpointsDependecy
{
    public static IServiceCollection AddEndpointsDependencies(this IServiceCollection services)
    {
        services.AddTransient(typeof(EndpointExecutor<>));
        
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        
        var handlerInterfaceType = typeof(IEndpointHandler<,>);
        var handlerType = Assembly
            .GetCallingAssembly()
            .GetTypes()
            .Where(type => !type.IsAbstract && !type.IsInterface)
            .SelectMany(type =>
                type.GetInterfaces()
                    .Where(i =>
                        i.IsGenericType && i.GetGenericTypeDefinition() == handlerInterfaceType
                    )
                    .Select(i => new { Interface = i, Implementation = type })
            );

        foreach (var handler in handlerType)
        {
            services.AddScoped(handler.Interface, handler.Implementation);
        }
        
        services.AddTransient<ISender, Sender>();

        services.AddTransient(typeof(EndpointExecutor<>));

        ServiceDescriptor[] endpointServiceDescriptors = Assembly
            .GetExecutingAssembly()
            .DefinedTypes.Where(type =>
                type is { IsAbstract: false, IsGenericType: false, IsGenericTypeDefinition: false }
                && typeof(IEndpoint).IsAssignableFrom(type)
            )
            .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type))
            .ToArray();

        services.TryAddEnumerable(endpointServiceDescriptors);

        return services;
    }
    
    public static IApplicationBuilder MapEndpoints(this IApplicationBuilder app)
    {
        app.UseEndpoints(endpoints =>
        {
            foreach (var endpoint in app.ApplicationServices.GetServices<IEndpoint>())
            {
                endpoint.MapEndpoint(endpoints);
            }
        });
    
        return app;
    }
}

