using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.DataAccess.Context.EntityExtensions;

public static class ChannelEntityExtensions
{
   public static async Task<List<Channel>> GetChannelsWithJustMyMembershipByUserId(this DbSet<Channel> channelsContext,  int userId, CancellationToken token = default, int skip = 0, int take = 1)
   {
      var channels = await channelsContext.Include(ch => ch.Members.Where(m => m.UserId == userId))
         .AsNoTracking()
         .AsSplitQuery()
         .Where(ch => ch.Members.Any(m => m.UserId == userId))
         .OrderBy(ch => ch.Id)
         .Skip(skip)
         .Take(take)
         .Select(ch => new Channel()
         {
            Name = ch.Name,
            Id = ch.Id,
            CreatedAt = ch.CreatedAt,
            UpdatedAt = ch.UpdatedAt,
            AdultContent = ch.AdultContent,
            Description = ch.Description,
            MembersCount = ch.Members.Count,
            ChannelPicture = ch.ChannelPicture,
            ChannelCover = ch.ChannelCover,
            Members = ch.Members,
            MyMember = ch.Members.FirstOrDefault(m => m.UserId == userId) ?? new()

              
         })
         .ToListAsync(token);

      return channels;
   }
   
   public static async Task<List<Channel>> GetChannelsWithJustMyMembershipByChannelId(this DbSet<Channel> channelsContext,  int userId, int channelId, CancellationToken token = default, int skip = 0, int take = 1)
   {
      var channels = await channelsContext.Include(ch => ch.Members.Where(m => m.UserId == userId))
         .AsNoTracking()
         .AsSplitQuery()
         .Where(ch => ch.Members.Any(m => m.UserId == userId))
         .OrderBy(ch => ch.Id)
         .Skip(skip)
         .Take(take)
         .Select(ch => new Channel()
         {
            Name = ch.Name,
            Id = ch.Id,
            CreatedAt = ch.CreatedAt,
            UpdatedAt = ch.UpdatedAt,
            AdultContent = ch.AdultContent,
            Description = ch.Description,
            MembersCount = ch.Members.Count,
            ChannelPicture = ch.ChannelPicture,
            ChannelCover = ch.ChannelCover,
            Members = ch.Members,
            MyMember = ch.Members.FirstOrDefault(m => m.UserId == userId) ?? new()
            
              
         })
         .ToListAsync(token);

      return channels;
   }
    
}