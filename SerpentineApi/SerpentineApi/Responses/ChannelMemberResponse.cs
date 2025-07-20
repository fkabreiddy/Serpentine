namespace SerpentineApi.Responses;

public class ChannelMemberResponse : BaseResponse
{
    public Ulid ChannelId { get; set; }
    public Ulid UserId { get; set; }
    public bool IsSilenced { get; set; }
    public bool IsArchived { get; set; }
    public bool IsOwner { get; set; }

    public DateTime LastAccess { get; set; } = DateTime.Now;

    public string UserProfilePictureUrl { get; set; } = "";

    public string UserUsername { get; set; } = "";

    public string UserName { get; set; } = "";

    public ChannelMemberRoleResponse Role { get; set; } = new();
    
    
}
