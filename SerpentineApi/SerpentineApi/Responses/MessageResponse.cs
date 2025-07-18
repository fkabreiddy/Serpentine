namespace SerpentineApi.Responses;

public class MessageResponse : BaseResponse
{
    public string Content { get; set; } = null!;
    public Ulid SenderId { get; set; }
    public UserResponse Sender { get; set; } = new();
    public Ulid GroupId { get; set; }
    public MessageResponse Parent { get; set; } = new();
    public Ulid ParentId { get; set; }
    public bool IsNotification { get; set; } = false;
}