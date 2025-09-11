using SerpentineApi.Features.UserFeatures.Actions;
using SerpentineApi.Helpers;

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

    public Ulid RoleId { get; set; }

    public List<ChannelMember> MyChannels { get; set; } = new List<ChannelMember>();
    public List<GroupAccess> MyAccesses { get; set; } = new List<GroupAccess>();
    public List<Message> MyMessages { get; set; } = new List<Message>();

    public List<ChannelBan> Bans { get; set; } = new();

    public Role Role { get; set; } = null!;

    public int GetAge(DateTime dateOfBirth)
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
            DayOfBirth = DayOfBirth,
            AccessLevel = Role.AccessLevel,
            Role = UserRolesHelper.GetRole(this),
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
