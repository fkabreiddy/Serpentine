namespace SerpentineApi.Responses;

public class ChannelBanResponse : BaseResponse
{
    public Ulid UserId { get; set; }
    public Ulid ChannelId { get; set; }
    public string Reason { get; set; } = "";
}
