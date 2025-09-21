using System.ComponentModel.DataAnnotations.Schema;
using SerpentineApi.Features.GroupFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class Group : BaseEntity
{
    [MaxLength(30), MinLength(3), RegularExpression(@"^[a-zA-Z0-9_]+$")]
    public string Name { get; set; } = null!;

    public List<Message> Messages { get; set; } = new();
    public List<GroupAccess> Accesses { get; set; } = new();
    public Channel Channel { get; set; } = null!;
    public Ulid ChannelId { get; set; }

    public bool Public { get; set; } = true;

    public bool RequiresOverage { get; set; } = false;

    [NotMapped]
    public GroupAccess? MyAccess { get; set; } = new();

    [NotMapped]
    public int UnreadMessages { get; set; } = 0;

    [NotMapped]
    public string ChannelName { get; set; } = "";

    [NotMapped]
    public Message? LastMessage { get; set; }

    public GroupResponse ToResponse() =>
        new()
        {
            Id = Id,
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt,
            MyAccess = MyAccess?.ToResponse() ?? null,
            Name = Name,
            ChannelId = ChannelId,
            RequiresOverage = RequiresOverage,
            UnreadMessages = UnreadMessages,
            ChannelName = ChannelName,
            Public = Public,
            LastMessage = LastMessage?.ToResponse() ?? null,
        };

    public static Group Create(CreateGroupRequest request) =>
        new()
        {
            Name = request.Name.Trim().ToLower(),
            ChannelId = request.ChannelId,
            RequiresOverage = request.RequiresOverage,
            Public = request.Public,
            Messages = new()
            {
                new() { Content = $"{request.Name} group was created!", IsNotification = true },
            },
            Accesses = new()
            {
                new() { UserId = request.CurrentUserId, LastReadMessageDate = DateTime.UtcNow },
            },
        };

    public bool Update(UpdateGroupRequest request)
    {
        bool hasBeenUpdated = false;

        if (Name != request.Name)
        {
            Name = request.Name;
            hasBeenUpdated = true;
        }

        if (Public != request.Public)
        {
            Name = request.Name;
            hasBeenUpdated = true;
        }

        if (RequiresOverage != request.RequiresOverage)
        {
            RequiresOverage = request.RequiresOverage;
            hasBeenUpdated = true;
        }

        if (hasBeenUpdated)
        {
            UpdatedAt = DateTime.UtcNow;
        }

        return hasBeenUpdated;
    }
}
