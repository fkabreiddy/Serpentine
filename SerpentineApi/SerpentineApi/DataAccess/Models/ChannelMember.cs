using SerpentineApi.Features.ChannelFeatures.Actions;
using SerpentineApi.Features.ChannelMemberFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class ChannelMember : BaseEntity
{
    public Channel Channel { get; set; } = null!;
    public User User { get; set; } = null!;
    public int ChannelId { get; set; }
    public int UserId { get; set; }
    public bool IsSilenced { get; set; } = false;
    public bool IsArchived { get; set; } = false;
    public bool IsOwner { get; set; } = false;
    public DateTime LastAccess { get; set; } = DateTime.Now;

    public ChannelMemberResponse ToResponse() => new()
    {
        Id = Id,
        ChannelId = ChannelId,
        UserId = UserId,
        CreatedAt = CreatedAt,
        UpdatedAt = UpdatedAt,
        IsOwner = IsOwner,
        IsSilenced = IsSilenced,
        IsArchived = IsArchived
    };

    public static ChannelMember Create(CreateChannelMemberRequest request) => new()
    {
        ChannelId = request.ChannelId,
        UserId = request.CurrentUserId,
        IsOwner = false
    };

}