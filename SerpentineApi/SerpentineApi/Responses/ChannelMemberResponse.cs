namespace SerpentineApi.Responses;

public class ChannelMemberResponse : BaseResponse
{
   
    public int ChannelId { get; set; }
    public int UserId { get; set; }
    public bool IsSilenced { get; set; }
    public bool IsArchived { get; set; }
    public bool IsOwner { get; set; }
    public DateTime LastAccess { get; set; } = DateTime.Now;
    
    

}