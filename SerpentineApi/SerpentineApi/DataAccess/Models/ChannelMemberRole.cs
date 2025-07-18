namespace SerpentineApi.DataAccess.Models;

public class ChannelMemberRole : BaseEntity
{
    public string Name { get; set; } = null!;
    
    public List<ChannelMember> Members { get; set; } = new List<ChannelMember>();
    
    

    public ChannelMemberRoleResponse ToResponse() => new()
    {
        Name = Name,
        Id = Id,
        CreatedAt = CreatedAt,
        UpdatedAt = UpdatedAt
    };
}