namespace SerpentineApi.Responses;

public class MessageResponse : BaseResponse
{
    public string Content { get; set; } = null!;
    public Ulid? SenderId { get; set; }
    public Ulid GroupId { get; set; }
    public Ulid? ParentId { get; set; }
    public bool IsNotification { get; set; } = false;
    public string? SenderName { get; set; }
    
    public string? SenderProfilePictureUrl { get; set; }
    
    public string? SenderUsername { get; set; }
    
    public string? ParentContent { get; set; }
    
    public Ulid? ChannelId { get; set; }
    
    public string? GroupName { get; set; }
    
    public string? ChannelName {get; set;}
    
    
}