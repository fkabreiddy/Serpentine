using SerpentineApi.Features.ChannelMemberFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class ChannelBan : BaseEntity
{
    public Ulid ChannelId {get; set;}
    public Channel Channel {get; set;} = null!;
    public Ulid UserId {get; set; }
    public User User {get; set; } = null!;
    
    [MaxLength(300), MinLength(5)]
    public string Reason { get; set; } = null!;

    public static ChannelBan Create(CreateChannelBanRequest request) => new()
    {
        UserId = request.ChannelId,
        ChannelId = request.UserId,
        Reason = request.Reason

    };

}