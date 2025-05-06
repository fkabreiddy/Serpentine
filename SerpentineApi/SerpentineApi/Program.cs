using Microsoft.AspNetCore.Diagnostics;
using SerpentineApi;
using SerpentineApi.Utilities;
using Scalar.AspNetCore;
using SerpentineApi.Dependencies;


var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets<Program>();

builder.Services.AddApiServices(builder);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "default", policy =>
    {
        policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        // Fluent API
        options
            .WithTitle("Serpentine API")
            .WithSidebar(true);
        // Bearer
        options
            .WithPreferredScheme("Bearer"); // Security scheme name from the OpenAPI document


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
            logger.LogError($"Server error: {contextFeature.Error.Message}");
           
            await context.Response.WriteAsJsonAsync(new ServerErrorApiResult()
            {
                Errors = [contextFeature.Error.Message]
            });
        }
    });
});


app.UseAuthentication();
app.UseRouting();
app.UseCors("default");

app.UseAuthorization();

app.MapEndpoints();
app.Run();

