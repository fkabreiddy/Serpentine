using System.ComponentModel.DataAnnotations.Schema;

namespace SerpentineApi.DataAccess.Models;

public class Group : BaseEntity
{
    [MaxLength(100), MinLength(3), RegularExpression(@"^[a-zA-Z0-9_]+$"),]
    public string Name { get; set; } = null!;
    public List<Message> Messages { get; set; } = new();
    public List<GroupAccess> Accesses { get; set; } = new();
    public Channel Channel { get; set; } = null!;
    public Ulid ChannelId { get; set; }
    
    
    [NotMapped]
    public int MessagesCount { get; set; }
    
    
}