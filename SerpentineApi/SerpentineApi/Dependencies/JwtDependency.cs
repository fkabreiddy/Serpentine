using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SerpentineApi.Identity;

namespace SerpentineApi.Dependencies;

public static class JwtDependency
{
     public static IServiceCollection AddJwtServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddOptions<JwtSettings>()
            .BindConfiguration("JWT")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddAuthorization(opts =>
        {
            opts.AddPolicy(
                JwtBearerDefaults.AuthenticationScheme,
                policy =>
                {
                    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                }
            );
        });
        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,

                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["JWT:Issuer"],
                    ValidAudience = configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            configuration["JWT:Key"] ?? throw new NullReferenceException("JWT KEY")
                        )
                    ),
                };
                options.Events = new JwtBearerEvents()
                {
                    OnChallenge = c =>
                    {
                        c.HandleResponse();
                        
                        var hasToken = c.Request.Headers.TryGetValue("Authorization", out var authHeader)
                                       && !string.IsNullOrWhiteSpace(authHeader)
                                       && authHeader.ToString().StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase);

                        if (!hasToken)
                        {
                           
                            c.Response.OnStarting(async () =>
                            {
                                c.Response.StatusCode = 401;
                                c.Response.ContentType = "application/json";
                                await c.Response.WriteAsJsonAsync(new UnauthorizedApiResult("The token or the Authorization header is missing"));
                            });

                        }
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        context.Response.OnStarting(async () =>
                        {
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsJsonAsync(new UnauthorizedApiResult("The token or the Authorization header is missing"));
                        });


                        
                        return Task.CompletedTask;
                    },
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        if (!string.IsNullOrEmpty(accessToken))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    },
                };
            });

        services.AddScoped<JwtBuilder>();

        return services;
    }
}