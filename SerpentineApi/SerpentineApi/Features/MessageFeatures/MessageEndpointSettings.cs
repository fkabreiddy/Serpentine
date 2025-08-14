namespace SerpentineApi.Features.MessageFeatures;

public class MessageEndpointSettings : IEndpointSettings
{
         public string BaseUrl { get; set; } = "api/v1/messages";
}