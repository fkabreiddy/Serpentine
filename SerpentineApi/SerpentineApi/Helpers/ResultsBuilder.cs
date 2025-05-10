namespace SerpentineApi.Helpers;

public class ResultsBuilder
{
    public static IResult Match<T>(IApiResult apiResult)
    {
        switch (apiResult)
        {
            case NotFoundApiResult:
                return Results.NotFound(apiResult);

            case ServerErrorApiResult:
                return Results.InternalServerError(apiResult);

            case BadRequestApiResult:
                return Results.BadRequest(apiResult);

            case SuccessApiResult<T>:
                return Results.Ok(apiResult);

            case UnauthorizedApiResult:
                return Results.Unauthorized();

          
            case ValidationApiResult:
                return Results.UnprocessableEntity(apiResult);

            default:
                return Results.BadRequest(apiResult);
        }
    }
    

}