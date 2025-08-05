namespace SerpentineApi.DataAccess.Models;

public class Message : BaseEntity
{
    [MaxLength(1000), MinLength(1)]
    public string Content { get; set; } = null!;
    public Ulid? SenderId { get; set; }
    public User? Sender { get; set; }
    public Ulid GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public Message? Parent { get; set; }
    public Ulid? ParentId { get; set; }

    public bool IsNotification { get; set; } = false;
    public List<Message> Replies { get; set; } = new();

    public MessageResponse ToResponse() => new()
    {
        Sender = Sender?.ToResponse() ?? null,
        Parent = Parent?.ToResponse() ?? null,
        Content = Content,
        GroupId = GroupId,
        IsNotification = IsNotification,
        SenderId = SenderId,
        ParentId = ParentId,
        Id = Id,
        CreatedAt = CreatedAt,
        UpdatedAt = UpdatedAt


    };
}
