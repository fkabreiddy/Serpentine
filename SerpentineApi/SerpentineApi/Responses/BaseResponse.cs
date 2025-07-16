namespace SerpentineApi.Responses;

public abstract class BaseResponse
{
    public Ulid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
