using System.Text;
using Spectre.Console;

internal class Program
{
    static async Task Main(string[] args)
    {
        var methods = new Dictionary<string, string>
        {
            { "Get", "[green]GET[/]" },
            { "Post", "[blue]POST[/]" },
            { "Put", "[yellow]PUT[/]" },
            { "Delete", "[red]DELETE[/]" },
            { "Patch", "[olive]PATCH[/]" },
        };

        AnsiConsole.MarkupLine("[bold green]Bienvenido al Feature Scaffolder![/]");

        var featureName = AnsiConsole.Ask<string>(
            "Como se llama la [green]feature?[/] por ejemplo, CreateChannel: "
        );

        var folderType = "Actions";

        var featureClassName = AnsiConsole.Prompt<string>(
            new SelectionPrompt<string>()
                .Title("Nombre de la [green]clase feature[/]?")
                .AddChoices<string>(
                    new string[]
                    {
                        "Channel",
                        "Group",
                        "User",
                        "Message",
                        "ChannelMember",
                        "GroupAccess",
                    }
                )
        );

        var responseClassName = AnsiConsole.Ask<string>(
            "Que tipo de dato va a retornar el endpoint? Puede ser una clase o struct?"
        );

        var method = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("Selecciona el [green]HttpMethod[/]:")
                .AddChoices(methods.Values)
        );

        var httpMethod = methods.First(m => m.Value == method).Key;

        if (httpMethod == "Get")
        {
            folderType = "Queries";
        }

        var route = AnsiConsole.Ask<string>("Escribe la [green]ruta[/] (ej. /create):");
        var bindingSource = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("Selecciona el [green]BindingSource[/]:")
                .AddChoices(new[] { "FromForm", "AsParameters", "FromBody" })
        );

        var confirmation = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title(
                    $"Seguro que quieres crear la feature ({folderType}) {method} [green]{featureClassName}[/] :: [blue]{route} => {responseClassName}[/]: ?"
                )
                .AddChoices(new[] { "Si", "No" })
        );

        if (confirmation == "No")
        {
            AnsiConsole.MarkupLine("[red]Cancelando...[/]");
            return;
        }

        var content =
            $@"using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.EntityFrameworkCore;
        using Scalar.AspNetCore;
        using SerpentineApi.Helpers;
        using Microsoft.AspNetCore.Mvc;

  

        namespace SerpentineApi.Features.{featureClassName}Features.Actions;

        public class {featureName}Request : IRequest<OneOf<{responseClassName}, Failure>>
        {{
            // Aquí va la estructura de tu request
        }}

        public class {featureName}RequestValidator : AbstractValidator<{featureName}Request>
        {{
            public {featureName}RequestValidator()
            {{
                // Validaciones
            }}
        }}

        internal class {featureName}Endpoint : IEndpoint
        {{
            private readonly {featureClassName}EndpointSettings _settings = new();
            public void MapEndpoint(IEndpointRouteBuilder app)
            {{
                app.Map{httpMethod}(
                    _settings.BaseUrl + ""{route}"",
                    async(
                        [{bindingSource}] {featureName}Request command,
                        EndpointExecutor<{featureName}Endpoint> executor,
                        CancellationToken cancellationToken,
                        ISender sender,
                        HttpContext context
                    ) => await executor.ExecuteAsync<{responseClassName}>(async () =>
                    {{{{
                        var result = await sender.SendAndValidateAsync(command, cancellationToken);

                        if (result.IsT1)
                        {{
                            var t1 = result.AsT1;

                            return ResultsBuilder.Match(t1);

                        }}

                        var t0 = result.AsT0;

                        return ResultsBuilder.Match<{responseClassName}>(new SuccessApiResult<{responseClassName}>(t0));

                    }}}})
                )
                .DisableAntiforgery()
                .RequireAuthorization(nameof(AuthorizationPolicies.AllowAllUsers))
                .RequireCors()
                .Experimental()
                .WithOpenApi()
                .WithDescription(""Requires Authorization. \n Requires CORS."")
                .WithTags(new string[]{{nameof(ApiHttpVerbs.{httpMethod}), nameof({featureClassName})}})
                .Accepts<{featureName}Request>(false, ApiContentTypes.ApplicationJson)
                .Produces<SuccessApiResult<{responseClassName}>>(200, ApiContentTypes.ApplicationJson)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .WithName(nameof({featureName}Endpoint));
            }}
        }}

        internal class {featureName}EndpointHandler : IEndpointHandler<{featureName}Request, OneOf<{responseClassName}, Failure>>
        {{
            public async Task<OneOf<{responseClassName}, Failure>> HandleAsync({featureName}Request request, CancellationToken cancellationToken = default)
            {{
                return new NotFoundApiResult();
            }}
        }}
        ";

        await AnsiConsole
            .Status()
            .StartAsync(
                "[green]Generando {featureClassName} en {folderType}...[/]",
                async ctx =>
                {
                    var featureFolder = Path.Combine(
                        "../SerpentineApi/Features",
                        featureClassName + "Features",
                        folderType
                    );
                    Directory.CreateDirectory(featureFolder);
                    Thread.Sleep(1000);
                    AnsiConsole.MarkupLine(":check_mark_button: [blue]Folder creado[/]");
                    ctx.Status("[green]Creando el archivo[/]...");

                    var filePath = Path.Combine(featureFolder, $"{featureName}.cs");
                    Thread.Sleep(500);
                    AnsiConsole.MarkupLine(":check_mark_button: [blue]Archivo creado[/]");

                    ctx.Status("[green]Escribiendo el archivo...[/]");
                    await File.WriteAllTextAsync(filePath, content, Encoding.UTF8);
                    Thread.Sleep(500);
                }
            );

        AnsiConsole.MarkupLine(":check_mark_button: [blue]Feature generada![/]");
    }
}
