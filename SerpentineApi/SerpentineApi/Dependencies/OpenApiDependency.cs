using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace SerpentineApi.Dependencies;

public static class OpenApiDependency
{
    public static IServiceCollection AddOpenApiServices(this IServiceCollection services)
    {
        services.AddOpenApi(opts =>
        {
            opts.AddDocumentTransformer<OpenApiConfigurer>();

        });
        return services;
    }
}

public class OpenApiConfigurer : IOpenApiDocumentTransformer
{
    public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken)
    {
        document.Info.Title = ApiConstants.Title;
        document.Info.Description = ApiConstants.Description;
        document.Info.Contact = new OpenApiContact
        {
            Name = "Breiddy Garcia",
            Email = "breiddysubzero@gmail.com",
            Url = new Uri("https://github.com/fkabreiddy")
        };
        var securitySchema =
            new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "JWT Authorization header using the Bearer scheme."
            };

        var securityRequirement =
            new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Id = ApiConstants.AuthenticationScheme,
                            Type = ReferenceType.SecurityScheme
                        }
                    },
                    []
                }
            };
        
        document.SecurityRequirements.Add(securityRequirement);
        document.Components = new OpenApiComponents()
        {
            SecuritySchemes = new Dictionary<string, OpenApiSecurityScheme>()
            {
                { ApiConstants.AuthenticationScheme, securitySchema }
            }
        };
        return Task.CompletedTask;
    }

  
}

public class ApiConstants
{
    public static  string Title { get;  } = "serpentine api";
    public static string Description { get;  } = "This api connects with the serpentine database";
    public static string AuthenticationScheme { get; } = JwtBearerDefaults.AuthenticationScheme;


}