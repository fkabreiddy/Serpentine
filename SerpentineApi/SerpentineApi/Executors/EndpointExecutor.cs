
using System.ComponentModel.DataAnnotations;
using SerpentineApi.Helpers;
using SerpentineApi.Utilities;
using ValidationException = SerpentineApi.Exceptions.ValidationException;

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
           
            return Results.BadRequest(new ValidationApiResult(
                "Invalid Request", 
                ex.Errors.Select(e => e.ErrorMessage).ToList()));
        }
        catch (Exception e)
        {
            caughtException = e;

            return ResultsBuilder.Match<T>(
               new ServerErrorApiResult(errors: new (){e.InnerException?.Message ?? e.Message})
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
