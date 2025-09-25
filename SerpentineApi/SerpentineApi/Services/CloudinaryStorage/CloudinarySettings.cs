namespace SerpentineApi.Services.CloudinaryStorage;

public class CloudinarySettings
{
    public required string Url { get; set; }
}

public static class CloudinaryFolders
{
    public const string ProfilePictures = "ProfilePictures";
    public const string ChannelBanners = "ChannelBanners";
    public const string ChannelCovers = "ChannelCovers";
    public const string MessagesImages = "MessagesImages";
}
