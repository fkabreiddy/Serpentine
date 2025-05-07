namespace SerpentineApi.Utilities;

public interface IApiResult
{
   public string Message { get; set; }
   public int StatusCode { get; }
   
   public List<string> Errors { get; set; }
}

public class SuccessApiResult<T> : IApiResult
{
   

    public SuccessApiResult(T data)
    {
        Data = data;
    }

    public T Data { get; set; } 
    public string Message { get; set; } = "Success";
    public int StatusCode { get; } = 200;
    public List<string> Errors { get; set; } = new();

   
}

public class NotFoundApiResult : IApiResult
{
    public string Message { get; set; } = "Not Found";
    public int StatusCode { get;  } =  404;
    public List<string> Errors { get; set; } = new() { "Not found" };

    
}

public class ValidationApiResult : IApiResult
{
    public string Message { get; set; } = "Invalid Request";
    public int StatusCode { get; } = 422;
    public List<string> Errors { get; set; } = new (){"Invalid Request"};

  
}

public class UnauthorizedApiResult : IApiResult
{
    public string Message { get; set; } = "Access Denied";
    public int StatusCode { get;  } = 401;
    public List<string> Errors { get; set; } = new() { "Access Denied" };


}

public class BadRequestApiResult : IApiResult
{
    public string Message { get; set; } = "Bad Request";
    public int StatusCode { get; } = 400;
    public List<string> Errors { get; set; } = new() { "Bad Request" };


}

public class ConflictApiResult : IApiResult
{
    public string Message { get; set; } =  "Conflict";
    public int StatusCode { get;  } = 409;
    public List<string> Errors { get; set; } = new(){"Conflict"};

   
}

public class ServerErrorApiResult : IApiResult
{
    public string Message { get; set; } = "Something went wrong with Serpentine";
    public  int StatusCode { get; }= 500;
    public List<string> Errors { get; set; } = new() { "Something went wrong with Serpentine" };

  
}