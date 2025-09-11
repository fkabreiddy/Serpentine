using System.Reflection;
using SerpentineApi.Features;

namespace SerpentineApi.DataAccess.Models;

public abstract class BaseEntity
{
    [Key]
    public Ulid Id { get; set; } = Ulid.NewUlid();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}
