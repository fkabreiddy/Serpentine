namespace SerpentineApi.DataAccess.Models;

public abstract class BaseEntity
{
    [Key]
    public Ulid Id { get; set; } = Ulid.NewUlid();

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
