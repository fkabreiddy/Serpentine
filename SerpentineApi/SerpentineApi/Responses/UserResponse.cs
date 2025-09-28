using System.Text.Json.Serialization;
using SerpentineApi.Helpers;

namespace SerpentineApi.Responses;

public class UserResponse : BaseResponse
{
    public string FullName { get; set; } = "";
    public string Username { get; set; } = "";
    public string ProfilePictureUrl { get; set; } = "";
    public int Age { get; set; } = 0;

    public DateTime DayOfBirth { get; set; } = DateTime.Now;

    [JsonIgnore]
    public UserRoles Role { get; set; } = UserRoles.User;

    public int AccessLevel { get; set; } = 0;

}
