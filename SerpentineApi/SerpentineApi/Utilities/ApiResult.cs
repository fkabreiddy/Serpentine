namespace SerpentineApi.Utilities;

public interface IApiResult
{
    public string Message { get; set; }
    public int StatusCode { get; }
    public bool IsSuccess { get; }

    public List<string> Errors { get; set; }

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
    
    public SuccessApiResult(T data, string message, bool success = true  )
    {
        Data = data;
        Message = message;
        IsSuccess = success;
    }

    public SuccessApiResult(T data, string message, bool success = true, int statusCode = 200)
    {
        Data = data;
        Message = message;

        IsSuccess = success;
        StatusCode = statusCode;
    }
    
    public T Data { get; set; }
    public bool IsSuccess { get; private set; } = true;
    public string Message { get; set; } = "Everything went well";
    public int StatusCode { get; private set; } = 200;
    public List<string> Errors { get; set; } = new();

}

public abstract class Failure : IApiResult
{
    public string Message { get; set; } = "";
    public int StatusCode { get; private set; } = 0;

    public bool IsSuccess { get; private set; } = false;

    public List<string> Errors { get; set; } = [];


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
    public NotFoundApiResult(string message = "The requested resource does not exist or has been deleted.", List<string>? messages = null)
    {
        Build(message, 404, messages);
    }


}

public class ForbiddenApiResult : Failure
{
    public ForbiddenApiResult(string message = "The requested resource is forbidden." , List<string>? messages = null)
    {
        Build(message, 403, messages);
    }
}



public class ValidationApiResult : Failure
{
    public ValidationApiResult(string message = "One or more parameters are invalid or missing or are invalid. Try again.", List<string>? messages = null)
    {
        Build(message, 422, messages);
    }
}

public class UnauthorizedApiResult : Failure
{
    public UnauthorizedApiResult(string message = "You are not authorized to access this resource.", List<string>? messages = null)
    {
        Build(message, 401, messages);
    }
}

public class BadRequestApiResult : Failure
{
    public BadRequestApiResult(string message =  "One or more parameters are invalid or missing.", List<string>? messages = null)
    {
        Build(message, 404, messages);
    }
}

public class ConflictApiResult : Failure
{
    public ConflictApiResult(string message = "The resource already exists or cannot be modified in its current state.", List<string>? messages = null)
    {
        Build(message, 409, messages);
    }
}

public class ServerErrorApiResult : Failure
{
    public ServerErrorApiResult(string message = "An unexpected error occurred. Please try again later.", List<string>? messages = null)
    {
        Build(message, 500, messages);
    }
}
