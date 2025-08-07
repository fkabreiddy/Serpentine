using SerpentineApi.Helpers;

namespace SerpentineApi.Executors;

public class EndpointExecutor<T>
{
    private ILogger _logger;

    Exception? caughtException = null;

    public EndpointExecutor(ILogger<T> logger)
    {
        _logger = logger;
    }

    public async Task<IResult> ExecuteAsync<TResponse>(Func<Task<IResult>> func)
    {
        try
        {
            _logger.LogInformation($"[{typeof(T).Name}] A Call was made to this endpoint...");

            return await func();
        }
        catch (UnauthorizedAccessException e)
        {
            caughtException = e;

            return Results.Unauthorized();
        }
        catch (FluentValidation.ValidationException ex)
        {
            caughtException = ex;

            return Results.UnprocessableEntity(
                new ValidationApiResult(
                    "Invalid Request",
                    ex.Errors.Select(e => e.ErrorMessage).ToList()
                )
            );
        }
        catch (Exception e)
        {
            caughtException = e;

            return ResultsBuilder.Match(
                new ServerErrorApiResult(e.InnerException?.Message ?? e.Message)
            );
        }
        finally
        {
            if (caughtException is not null)
            {
                _logger?.LogCritical(

                    $"[{typeof(T).Name}] An exception has occurred: {caughtException.InnerException?.Message ?? caughtException.Message}"
                );
            }
        }
    }
}
