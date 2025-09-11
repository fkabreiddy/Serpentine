using System.ComponentModel.DataAnnotations.Schema;
using SerpentineApi.Features.MessageFeatures.Actions;

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

    [NotMapped]
    public string? SenderName { get; set; }

    [NotMapped]
    public string? SenderProfilePictureUrl { get; set; }

    [NotMapped]
    public string? SenderUsername { get; set; }

    [NotMapped]
    public IEnumerable<char>? ParentContent { get; set; }

    [NotMapped]
    public Ulid? ChannelId { get; set; }

    [NotMapped]
    public string? GroupName { get; set; }

    [NotMapped]
    public string? ChannelName { get; set; }

    public static Message Create(CreateMessageRequest request) =>
        new()
        {
            Content = request.Content,
            ParentId = request.ParentId,
            SenderId = request.IsNotification ? null : request.CurrentUserId,
            GroupId = request.GroupId,
            IsNotification = request.IsNotification,
        };

    public MessageResponse ToResponse() =>
        new()
        {
            SenderName = SenderName ?? null,
            SenderUsername = SenderUsername ?? null,
            SenderProfilePictureUrl = SenderProfilePictureUrl ?? null,
            ParentContent = ParentContent is not null ? new string(ParentContent.ToArray()) : null,
            Content = Content,
            GroupId = GroupId,
            IsNotification = IsNotification,
            SenderId = SenderId,
            ParentId = ParentId,
            ChannelId = ChannelId,
            GroupName = GroupName,
            ChannelName = ChannelName,
            Id = Id,
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt,
        };
}
