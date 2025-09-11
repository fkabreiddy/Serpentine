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

    public bool IsAdmin { get; set; } = false;

    public DateTime LastAccess { get; set; } = DateTime.UtcNow;

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
            IsOverage = User.GetAge(User.DayOfBirth) >= 18,
            UserName = User.FullName,
            UserUsername = User.Username,
            IsAdmin = IsAdmin,
        };

    public static ChannelMember Create(CreateChannelMemberRequest request) =>
        new()
        {
            ChannelId = request.ChannelId,
            UserId = request.CurrentUserId,
            IsOwner = false,
            IsAdmin = false,
        };
}
