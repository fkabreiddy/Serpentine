using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {
        Console.WriteLine("Welcome to the Feature Scaffolder!");

        if (args.Length == 0)
        {
            Console.WriteLine("Usage: dotnet run <FeatureName eg. Channel> <FolderType eg. Actions or Queries> <FeatureClassName eg. CreateChannel> <ResponseClassName eg. ChannelResponse> <HttpMethod eg. POST> <Route eg. /create> (Optional)<BindingSource eg. FromForm or AsParameters, etc>");
            return;
        }


        var featureName = args[0];
        var folderType = args[1]; // e.g., Actions or Queries
        var featureClassName = args[2];
        var responseClassName = args[3];
        var httpMethod = args[4].ToLower();
        var route = args[5]; // Optional route parameter
        var bindingSource = args.Length > 6 ? args[6] : "AsParameters"; // Default to AsParameters if not provided

        httpMethod = char.ToUpper(httpMethod[0]) + httpMethod.Substring(1); // e.g., POST, Get, Put, Delete

        var featureFolder = Path.Combine("../SerpentineApi/Features", featureName + "Features", folderType);
        Directory.CreateDirectory(featureFolder);

        var filePath = Path.Combine(featureFolder, $"{featureClassName}.cs");

        var content = $@"using System.Text.Json.Serialization;
        using FluentValidation;
        using Microsoft.EntityFrameworkCore;
        using Scalar.AspNetCore;
        using SerpentineApi.Helpers;
  

        namespace SerpentineApi.Features.{featureName}Features.Actions;

        public class {featureClassName}Request : IRequest<OneOf<{responseClassName}, Failure>>
        {{
            // Aquí va la estructura de tu request
        }}

        public class {featureClassName}RequestValidator : AbstractValidator<{featureClassName}Request>
        {{
            public {featureClassName}RequestValidator()
            {{
                // Validaciones
            }}
        }}

        internal class {featureClassName}Endpoint : IEndpoint
        {{
            private readonly {featureName}EndpointSettings _settings = new();
            public void MapEndpoint(IEndpointRouteBuilder app)
            {{
                app.Map{httpMethod}(
                    _settings.BaseUrl + ""{route}"",
                    async(
                        [{bindingSource}] {featureClassName}Request command,
                        EndpointExecutor<{featureClassName}Endpoint> executor,
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
                .RequireAuthorization(nameof(AuthorizationPolicies.OnlyDevelopers))
                .RequireCors()
                .Experimental()
                .WithOpenApi()
                .WithDescription(""Requires Authorization. \n Requires CORS."")
                .WithTags(new string[]{{nameof(ApiHttpVerbs.{httpMethod}), nameof({featureName})}})
                .Accepts<{featureClassName}Request>(false, ApiContentTypes.ApplicationJson)
                .Produces<SuccessApiResult<{responseClassName}>>(200, ApiContentTypes.ApplicationJson)
                .Produces<BadRequestApiResult>(400, ApiContentTypes.ApplicationJson)
                .Produces<ServerErrorApiResult>(500, ApiContentTypes.ApplicationJson)
                .Produces<ValidationApiResult>(422, ApiContentTypes.ApplicationJson)
                .WithName(nameof({featureClassName}Endpoint));
            }}
        }}

        internal class {featureClassName}EndpointHandler : IEndpointHandler<{featureClassName}Request, OneOf<{responseClassName}, Failure>>
        {{
            public async Task<OneOf<{responseClassName}, Failure>> HandleAsync({featureClassName}Request request, CancellationToken cancellationToken = default)
            {{
                return new NotFoundApiResult();
            }}
        }}
        ";

        File.WriteAllText(filePath, content, Encoding.UTF8);
        Console.WriteLine($"Archivo generado: {filePath}");
    }
}