using SerpentineApi.Features.UserFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class User : BaseEntity
{

    [Required, MaxLength(30), MinLength(3), RegularExpression(@"^[a-zA-Z0-9._]+$")]
    public string Username { get; set; } = null!;
    
    [Required, MinLength(1)]
    public string Password { get; set; } = null!;
    
    public string? ProfilePictureUrl { get; set; }
    
    [Required, MaxLength(30), MinLength(10), RegularExpression(@"^[a-zA-Z0-9]+$")]
    public string FullName { get; set; } = null!;
    
    [Required, Range(16, 100)]
    public int Age { get; set; }
    
    public List<ChannelMember> MyChannels { get; set; } = new List<ChannelMember>();
    
    

    public UserResponse ToResponse() => new()
    {
        Id = Id,
        FullName = FullName,
        Username = Username,
        ProfilePictureUrl = ProfilePictureUrl ?? "",
        Age = Age,
    };

    public static User Create(CreateUserRequest request)
        => new()
        {
            FullName = request.FullName.Trim(),
            Username = request.Username.Trim(),
            Password = request.Password.Hash(),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };



}