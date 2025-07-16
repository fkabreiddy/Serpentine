namespace SerpentineApi.Responses;

public class GroupResponse : BaseResponse
{
    public string Name { get; set; } = null!;
    public int UnreadMessages { get; set; } = 0;
    public string ChannelName { get; set; } = null!;
    public Ulid ChannelId { get; set; }
    public int MessagesCount { get; set; }
    public GroupAccess MyAccess { get; set; } = new();
}