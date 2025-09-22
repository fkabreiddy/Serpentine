namespace SerpentineApi.Services.CloudinaryStorage;

public class CloudinarySettings
{
    public required string Url { get; set; }
}

public enum CloudinaryFolders
{
    ProfilePictures,
    ChannelBanners,
    ChannelCovers,

    MessagesImages,
}
