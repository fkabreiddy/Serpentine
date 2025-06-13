using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using SerpentineApi.Features.ChannelFeatures.Actions;

namespace SerpentineApi.DataAccess.Models;

public class Channel : BaseEntity
{
    [MaxLength(100),
     MinLength(3),
     RegularExpression(@"^[a-zA-Z0-9._]+$"), 
     Required]
    public string Name { get; set; } = null!;

    [MaxLength(500), MinLength(10), Required]
    public string Description { get; set; } = null!;

    public bool AdultContent { get; set; } = false;
    
    public List<ChannelMember> Members { get; set; } = new List<ChannelMember>();

    public string? ChannelCover {get; set;}

    public string? ChannelPicture {get; set;}

    [NotMapped]
    public int MembersCount { get; set; } = 0;

    [NotMapped]
    public ChannelMember MyMember { get; set; } = new();
    
    
    
    public ChannelResponse ToResponse() => new() //userId is the user that is making the request. Its appends the membership of that user in a channel.
    {
        Id = Id,
        CreatedAt = CreatedAt,
        AdultContent = AdultContent,
        Name = Name,
        Description = Description,
        UpdatedAt = UpdatedAt,
        MembersCount = MembersCount,
        MyMember = MyMember.ToResponse(),
        ChannelBanner = ChannelPicture ?? "",
        ChannelCover = ChannelCover ?? ""

    };
    
    

    public static Channel Create(CreateChannelRequest request)
        => new()
        {
            Name = request.Name.ToLower().Trim(),
            Description = request.Description.Trim(),
            AdultContent = request.AdultContent,
            UpdatedAt = DateTime.Now,
            CreatedAt = DateTime.Now,
            MembersCount = 1,
            Members = [new(){UserId = request.CurrentUserId, IsOwner = true, LastAccess = DateTime.Now}]
        };

    public bool Update(UpdateChannelRequest request)
    {
        bool hasBeenUpdated = false;

        if (request.AdultContent != AdultContent)
        {
            AdultContent = request.AdultContent;
            hasBeenUpdated = true;
        }
        
        if (request.Name != Name)
        {
            Name = request.Name;
            hasBeenUpdated = true;
        }
        
        if (request.Description != Description)
        {
            Description = request.Description;
            hasBeenUpdated = true;
        }

        if (hasBeenUpdated)
        {
            UpdatedAt = DateTime.Now;
        }
        return hasBeenUpdated;

    }

}