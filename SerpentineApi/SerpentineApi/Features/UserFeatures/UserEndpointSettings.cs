namespace SerpentineApi.Features.UserFeatures;

public class UserEndpointSettings : IEndpointSettings
{
    public string BaseUrl { get; set; } = "api/v1/users";
}
