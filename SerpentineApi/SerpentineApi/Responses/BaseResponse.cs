namespace SerpentineApi.Responses;

public abstract class BaseResponse
{
    public Ulid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedAtIso => CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ");
    public string UpdatedAtIso => UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ");
}
