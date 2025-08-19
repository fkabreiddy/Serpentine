namespace SerpentineApi.Responses;

public class GroupResponse : BaseResponse
{
    public string Name { get; set; } = null!;
    public int UnreadMessages { get; set; } = 0;
    public string ChannelName { get; set; } = null!;
    public Ulid ChannelId { get; set; }

    public bool RequiresOverage { get; set; } = false;

    public bool Public { get; set; } = true;
    public GroupAccessResponse? MyAccess { get; set; } 
    
    public MessageResponse? LastMessage { get; set; } 
}
