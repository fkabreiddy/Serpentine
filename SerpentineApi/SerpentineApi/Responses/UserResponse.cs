namespace SerpentineApi.Responses;

public class UserResponse : BaseResponse
{
    public string FullName { get; set; } = "";
    public string Username { get; set; } = "";
    public string ProfilePictureUrl { get; set; } = "";
    public int Age { get; set; } = 0;
    
   
    
}