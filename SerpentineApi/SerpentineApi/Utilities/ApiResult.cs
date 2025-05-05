using System.Diagnostics.CodeAnalysis;

namespace SerpentineApi.Utilities;

public interface IApiResult
{
   public string Message { get; set; }
   public int StatusCode { get; set;  }
   
   public List<string> Errors { get; set; }
}

public class SuccessApiResult<T>(T data, string message = "Success") : IApiResult
{
    public T Data { get; set; } = data;
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = 200;
    public List<string> Errors { get; set; } = [];

}

public class NotFoundApiResult(string message = "Not Found", List<string>? errors = null) : IApiResult
{
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = 404;
    public List<string> Errors { get; set; } = errors ?? ["Not Found"];

}

public class ValidationApiResult(string message = "Invalid Request", List<string>? errors = null) : IApiResult
{
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = 422;
    public List<string> Errors { get; set; } = errors ?? ["Invalid Request"];
}

public class UnauthorizedApiResult(string message = "Unauthorized", List<string>? errors = null) : IApiResult
{
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = 401;
    public List<string> Errors { get; set; } = errors ?? ["Unauthorized"];
}

public class BadRequestApiResult(string message = "Bad Request", List<string>? errors = null) : IApiResult
{
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = 400;
    public List<string> Errors { get; set; } = errors ?? ["Bad Request"];
}

public class ServerErrorApiResult(string message = "Something went wrong with Serpentine", List<string>? errors = null) : IApiResult
{
    public string Message { get; set; } = message;
    public int StatusCode { get; set; } = 500;
    public List<string> Errors { get; set; } = errors ?? ["Something went wrong with Serpentine"];
}