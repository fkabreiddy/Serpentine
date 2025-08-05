namespace SerpentineApi.DataAccess.Models;

public class Role : BaseEntity
{
    public string Name { get; set; } = "user";
    public int AccessLevel { get; set; } = 0;
    public List<User> Users { get; set; } = new List<User>();

}