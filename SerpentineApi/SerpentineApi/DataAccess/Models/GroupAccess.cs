namespace SerpentineApi.DataAccess.Models;

public class GroupAccess : BaseEntity
{
    public Ulid GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public Ulid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime LastAccess { get; set; }

    public GroupAccessResponse ToResponse() => new()
    {
        Id = Id,
        CreatedAt = CreatedAt,
        UpdatedAt = UpdatedAt,
        LastAccess = LastAccess,
        GroupId = GroupId,
        UserId = UserId
    };
}
