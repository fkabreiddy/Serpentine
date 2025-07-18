using System.ComponentModel.DataAnnotations.Schema;
using SerpentineApi.Features.GroupFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class Group : BaseEntity
{
    [MaxLength(100), MinLength(3), RegularExpression(@"^[a-zA-Z0-9_]+$")]
    public string Name { get; set; } = null!;
    public List<Message> Messages { get; set; } = new();
    public List<GroupAccess> Accesses { get; set; } = new();
    public Channel Channel { get; set; } = null!;
    public Ulid ChannelId { get; set; }
    

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
            MyAccess = MyAccess?.ToResponse() ?? new(),
            Name = Name,
            ChannelId = ChannelId,
            UnreadMessages = UnreadMessages,
            ChannelName = ChannelName,
            LastMessage = LastMessage?.ToResponse() ?? new()
        };

    public static Group Create(CreateGroupRequest request) =>
        new()
        {
            Name = request.Name.Trim().ToLower(),
            ChannelId = request.ChannelId,
            Messages = new()
            {
                new() { Content = $"{request.Name} group was created!", IsNotification = true },
            },
            Accesses = new()
            {
                new() { UserId = request.CurrentUserId, LastAccess = DateTime.Now },
            },
        };
}
