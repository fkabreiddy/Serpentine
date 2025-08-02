namespace SerpentineApi.Utilities;

public interface IApiResult
{
    public string Message { get; set; }
    public int StatusCode { get; }
    public bool IsSuccess { get; }

    public List<string> Errors { get; set; }

    public string ResultTitle { get; set; }
}

public class SuccessApiResult<T> : IApiResult
{
    public SuccessApiResult(T data)
    {
        Data = data;
    }

    public SuccessApiResult(T data, string message)
    {
        Data = data;
        Message = message;
    }

    public T Data { get; set; }
    public bool IsSuccess { get; private set; } = true;
    public string Message { get; set; } = "Everything went well";
    public int StatusCode { get; private set; } = 200;
    public List<string> Errors { get; set; } = new();

    public string ResultTitle { get; set; } = "Operation Complete Successfully";
}

public abstract class Failure : IApiResult
{
    public string Message { get; set; } = "";
    public int StatusCode { get; private set; } = 0;

    public bool IsSuccess { get; private set; } = false;

    public List<string> Errors { get; set; } = [];

    public string ResultTitle { get; set; } = "Failure";

    public void Build(string message, int statusCode, List<string>? messages = null)
    {
        Message = message;
        StatusCode = statusCode;
        Errors = messages ?? [message];
        IsSuccess = false;
    }
}

public class NotFoundApiResult : Failure
{
    public NotFoundApiResult(string message = "Resource Not Found", List<string>? messages = null)
    {
        Build(message, 404, new() { "The requested resource does not exist or has been deleted." });
    }

    
}

public class ForbiddenApiResult : Failure
{
    public ForbiddenApiResult(string message = "Forbidden Resource", List<string>? messages = null)
    {
        Build(message, 403, new() { "The requested resource is forbbiden." });
    }
}



public class ValidationApiResult : Failure
{
    public ValidationApiResult(string message = "Invalid Request", List<string>? messages = null)
    {
        Build(message, 422, messages ?? new() { "One or more parameters are invalid or missing or are invalid. Try again." });
    }
}

public class UnauthorizedApiResult : Failure
{
    public UnauthorizedApiResult(string message = "Unauthorized Access", List<string>? messages = null)
    {
        Build(message, 401, new() { "You are not authorized to access this resource." });
    }
}

public class BadRequestApiResult : Failure
{
    public BadRequestApiResult(string message = "Bad Request", List<string>? messages = null)
    {
        Build(message, 404, new() { "One or more parameters are invalid or missing." });
    }
}

public class ConflictApiResult : Failure
{
    public ConflictApiResult(string message = "Conflict Detected", List<string>? messages = null)
    {
        Build(message, 409, new() { "The resource already exists or cannot be modified in its current state." });
    }
}

public class ServerErrorApiResult : Failure
{
    public ServerErrorApiResult(string message = "Server error", List<string>? messages = null)
    {
        Build(message, 500, new() { "An unexpected error occurred. Please try again later." });
    }
}
