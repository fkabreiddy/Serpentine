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
            _logger.LogInformation($"Calling: {typeof(T)}");

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

            return Results.BadRequest(new ValidationApiResult()
            {
                Message = "Invalid Request",
                Errors = ex.Errors.Select(e => e.ErrorMessage).ToList()
            });


        }
        catch (Exception e)
        {
            caughtException = e;

            return ResultsBuilder.Match<T>(
                new ServerErrorApiResult()
                {
                    Errors = new() { e.InnerException?.Message ?? e.Message }
                }
            );

        }
        finally
        {
            if (caughtException is not null)
            {
               
                _logger?.LogError(
                    caughtException.InnerException?.Message ?? caughtException.Message
                );
            }
        }
    }
}
