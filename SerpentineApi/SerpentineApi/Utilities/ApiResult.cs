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

    public string ResultTitle { get; set; } = "Success";
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
    public NotFoundApiResult(string message = "Not Found", List<string>? messages = null)
    {
        Build(message, 404, new() { message });
    }
}

public class ValidationApiResult : Failure
{
    public ValidationApiResult(string message = "Invalid Request", List<string>? messages = null)
    {
        Build(message, 422, messages ?? new() { message });
    }
}

public class UnauthorizedApiResult : Failure
{
    public UnauthorizedApiResult(string message = "Unauthorized", List<string>? messages = null)
    {
        Build(message, 401, new() { message });
    }
}

public class BadRequestApiResult : Failure
{
    public BadRequestApiResult(string message = "Bad Request", List<string>? messages = null)
    {
        Build(message, 404, new() { message });
    }
}

public class ConflictApiResult : Failure
{
    public ConflictApiResult(string message = "Conflict", List<string>? messages = null)
    {
        Build(message, 404, new() { message });
    }
}

public class ServerErrorApiResult : Failure
{
    public ServerErrorApiResult(string message = "Server error", List<string>? messages = null)
    {
        Build(message, 500, new() { message });
    }
}
