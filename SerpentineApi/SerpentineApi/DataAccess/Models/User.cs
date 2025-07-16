using SerpentineApi.Features.UserFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class User : BaseEntity
{
    [Required, MaxLength(30), MinLength(3), RegularExpression(@"^[a-zA-Z0-9._]+$")]
    public string Username { get; set; } = null!;

    [Required, MinLength(1)]
    public string Password { get; set; } = null!;

    public string? ProfilePictureUrl { get; set; }

    [Required, MaxLength(30), MinLength(3)]
    public string FullName { get; set; } = null!;

    public DateTime DayOfBirth { get; set; } = DateTime.Now;

    public List<ChannelMember> MyChannels { get; set; } = new List<ChannelMember>();
    public List<GroupAccess> MyAccesses { get; set; } = new List<GroupAccess>();
    public List<Message> MyMessages { get; set; } = new List<Message>();

    private int GetAge(DateTime dateOfBirth)
    {
        DateTime hoy = DateTime.Now;
        int edad = hoy.Year - dateOfBirth.Year;

        // Si aún no ha cumplido años este año, se resta uno
        if (dateOfBirth.Date > hoy.AddYears(-edad))
        {
            edad--;
        }

        return edad;
    }

    public UserResponse ToResponse() =>
        new()
        {
            Id = Id,
            FullName = FullName,
            Username = Username,
            ProfilePictureUrl = ProfilePictureUrl ?? "",
            Age = GetAge(DayOfBirth),
        };

    public static User Create(CreateUserRequest request) =>
        new()
        {
            FullName = request.FullName.Trim(),
            Username = request.Username.Trim().ToLower(),
            Password = request.Password.Hash(),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            DayOfBirth = request.DayOfBirth,
        };
}
