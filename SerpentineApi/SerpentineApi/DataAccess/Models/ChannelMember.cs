using SerpentineApi.Features.ChannelFeatures.Actions;
using SerpentineApi.Features.ChannelMemberFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class ChannelMember : BaseEntity
{
    public Channel Channel { get; set; } = null!;
    public User User { get; set; } = null!;
    public Ulid ChannelId { get; set; }
    public Ulid UserId { get; set; }
    public bool IsSilenced { get; set; } = false;
    public bool IsArchived { get; set; } = false;
    public bool IsOwner { get; set; } = false;
    public DateTime LastAccess { get; set; } = DateTime.Now;
    public Ulid? RoleId { get; set; }
    public ChannelMemberRole? Role { get; set; }

    public ChannelMemberResponse ToResponse() =>
        new()
        {
            Id = Id,
            ChannelId = ChannelId,
            UserId = UserId,
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt,
            IsOwner = IsOwner,
            IsSilenced = IsSilenced,
            IsArchived = IsArchived,
            UserProfilePictureUrl = User.ProfilePictureUrl ?? "",
            UserName = User.FullName,
            Role = Role?.ToResponse() ?? new(),
            UserUsername = User.Username,
        };

    public static ChannelMember Create(CreateChannelMemberRequest request) =>
        new()
        {
            ChannelId = request.ChannelId,
            UserId = request.CurrentUserId,
            IsOwner = false,
        };
}
