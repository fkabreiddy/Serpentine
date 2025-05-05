namespace SerpentineApi.Responses;

public class UserResponse : BaseResponse
{
    public string FullName { get; set; } = "";
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string RoleName { get; set; } = "";
    public string ProfilePictureUrl { get; set; } = "";
}