using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace SerpentineApi.Dependencies;

public static class OpenApiDependency
{
    public static IServiceCollection AddOpenApiServices(this IServiceCollection services)
    {
        services.AddOpenApi(ApiConstants.DocumentName,opts =>
        {
            opts.AddDocumentTransformer<OpenApiConfigurer>();
        });
        return services;
    }
}
public class OpenApiConfigurer : IOpenApiDocumentTransformer
{
    public Task TransformAsync(
        OpenApiDocument document,
        OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken)
    {
        document.Info = new OpenApiInfo
        {
            
            Title = ApiConstants.Title,
            Description = ApiConstants.Description,
            Version = "v1",
            Contact = new OpenApiContact
            {
                Name = "Breiddy Garcia",
                Email = "breiddysubzero@gmail.com",
                Url = new Uri("https://github.com/fkabreiddy"),
            }
        };

        var securitySchema = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            BearerFormat = "JWT",
            Description = "JWT Authorization header using the Bearer scheme.",
            In = ParameterLocation.Header,
            Name = "Authorization"
        };

        var securityRequirement = new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Id = ApiConstants.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme,
                    },
                    In = ParameterLocation.Header,
                    Name = "Authorization"
                },
                Array.Empty<string>()
            }
        };

        document.SecurityRequirements ??= new List<OpenApiSecurityRequirement>();
        document.SecurityRequirements.Add(securityRequirement);

        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();
        document.Components.SecuritySchemes[ApiConstants.AuthenticationScheme] = securitySchema;

        return Task.CompletedTask;
    }
}

public class ApiConstants
{
    public static string Title { get; } = "Serpentine API V1";

    public static string DocumentName { get; } = "serpentine_v1_openapi";
    public static string Description { get; } = "This api connects with the serpentine database";
    public static string AuthenticationScheme { get; } = JwtBearerDefaults.AuthenticationScheme;
}
