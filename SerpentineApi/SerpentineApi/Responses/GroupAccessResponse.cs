namespace SerpentineApi.Responses;

public class GroupAccessResponse : BaseResponse
{
    public Ulid GroupId { get; set; }
    public Ulid UserId { get; set; }
    public DateTime LastReadMessageDate { get; set; } = DateTime.UtcNow;
}
