namespace SerpentineApi.Features;

public interface IEndpointSettings
{
    public string BaseUrl { get; set; }
}

public enum ApiHttpVerbs
{
    Get,
    Put,
    Delete,
    Patch,
    Post
}

public static class ApiContentTypes
{
    public static readonly string ApplicationJson = "application/json";
    public static readonly string MultipartForm = "multipart/form";

    

}
