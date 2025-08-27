using SerpentineApi.Features.GroupAccessFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class GroupAccess : BaseEntity
{
    public Ulid GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public Ulid UserId { get; set; }
    public User User { get; set; } = null!;
   
    public DateTime LastReadMessageDate { get; set; } = DateTime.UtcNow;

    public static GroupAccess Create(CreateGroupAccessRequest request) => new()
    {
        UserId = request.CurrentUserId,
        GroupId = request.GroupId,
        LastReadMessageDate = request.LastReadMessageDate,
    };


    public GroupAccessResponse ToResponse() => new()
    {
        Id = Id,
        CreatedAt = CreatedAt,
        UpdatedAt = UpdatedAt,
        GroupId = GroupId,
        UserId = UserId,
        LastReadMessageDate =  LastReadMessageDate,
    };
}
