using System.ComponentModel.DataAnnotations;
using SerpentineApi.Features.UserFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class User : BaseEntity
{

    [Required, MaxLength(30), MinLength(3), RegularExpression(@"^[a-zA-Z0-9._]+$")]
    public string Username { get; set; } = null!;
    
    [Required, MaxLength(30), MinLength(8)]
    public string Password { get; set; } = null!;
    
    public string? ProfilePictureUrl { get; set; }
    
    [Required, MaxLength(30), MinLength(10), RegularExpression(@"^[a-zA-Z0-9]+$")]
    public string FullName { get; set; } = null!;
    
    [Required, Range(16, 100)]
    public int Age { get; set; }

    public UserResponse ToResponse() => new()
    {
        FullName = FullName,
        Username = Username,
        ProfilePictureUrl = ProfilePictureUrl ?? string.Empty,
        Age = Age
    };

    public static User Create(CreateUserRequest request)
        => new()
        {
            Age = request.Age,
            FullName = request.FullName.Trim(),
            Username = request.Username.Trim(),
            Password = request.Password.Trim(),
            ProfilePictureUrl = request.ProfilePictureUrl ,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };



}