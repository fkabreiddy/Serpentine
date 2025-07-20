namespace SerpentineApi.Responses;

public class MessageResponse : BaseResponse
{
    public string Content { get; set; } = null!;
    public Ulid? SenderId { get; set; }
    public UserResponse? Sender { get; set; } 
    public Ulid GroupId { get; set; }
    public MessageResponse? Parent { get; set; }
    public Ulid? ParentId { get; set; }
    public bool IsNotification { get; set; } = false;
}