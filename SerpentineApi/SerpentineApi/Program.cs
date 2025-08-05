using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using Scalar.AspNetCore;
using SerpentineApi;
using SerpentineApi.Dependencies;
using SerpentineApi.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddSimpleConsole(options =>
{
    options.TimestampFormat = "[yyyy-MM-dd HH:mm:ss] ";
    options.IncludeScopes = false;
    options.SingleLine = false;
});
builder.Configuration.AddUserSecrets<Program>();

builder.Services.AddApiServices(builder);
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: "default",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000", "http://localhost:5000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    );
});
builder.Services.AddCacheServices();

builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();

builder.Services.AddSignalRServices();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApiServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); //REMEMBER TO ADD POLICY ON DEPLOYMENT
    app.MapScalarApiReference(options =>
    {
        // Fluent API
        options.WithTitle("Serpentine API")
            .AddDocument(ApiConstants.DocumentName)
            .WithSidebar(true);
        
        // Bearer
        options.Authentication = new ScalarAuthenticationOptions
        {
            PreferredSecuritySchemes = [ApiConstants.AuthenticationScheme],
            
            
        }; // Security scheme name from the OpenAPI document
    });
}

app.UseHttpsRedirection();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (contextFeature is not null)
        {
            logger.LogCritical($"Server Error: {contextFeature.Error.Message}");

            await context.Response.WriteAsJsonAsync(
                new ServerErrorApiResult() { Errors = [contextFeature.Error.Message] }
            );
        }
    });
});


app.UseAuthentication();
app.UseRouting();
app.UseCors("default");

app.UseAuthorization();
app.MapHub<ActiveUsersHub>(
    "hub/active-users",
    options =>
    {
        options.AllowStatefulReconnects = true;
        options.CloseOnAuthenticationExpiration = true;
    }
);
app.MapHub<ActiveChannelsHub>(
    "hub/active-channels",
    options =>
    {
        options.AllowStatefulReconnects = true;
        options.CloseOnAuthenticationExpiration = true;
    }
);
app.MapEndpoints();
app.Run();
