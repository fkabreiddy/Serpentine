namespace SerpentineApi.Responses;

public class ChannelResponse : BaseResponse
{

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public bool AdultContent { get; set; } = false;

    public ChannelMemberResponse MyMember { get; set; } = new();

    public int MembersCount { get; set; } = 0;

    public string CoverPicture { get; set; } = "";

    public string BannerPicture { get; set; } = "";

    public int UnreadMessages { get; set; } = 0;


   
    
    



}