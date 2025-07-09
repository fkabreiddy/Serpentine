namespace SerpentineApi.Hubs;

public class HubResult<T>
{
    public HubResult(bool succeeded, string message = "Something went wrong")
    {
        Message = message;
        IsSuccess = succeeded;
    }
    
    public HubResult(T data, string message = "Success")
    {
        Data = data;
        Message = message;
        IsSuccess = true;
    }

    public T? Data { get; set; } = default;
    public string Message { get; set; } = "";
    public bool IsSuccess { get; set; } = false;
}