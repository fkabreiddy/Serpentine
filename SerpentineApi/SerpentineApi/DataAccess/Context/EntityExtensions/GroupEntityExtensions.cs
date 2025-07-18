using Microsoft.EntityFrameworkCore;
using SerpentineApi.Helpers;

namespace SerpentineApi.DataAccess.Context.EntityExtensions;

public static class GroupEntityExtensions
{
    public static async Task<Group?> GetGroupWithJustMyAccessByGroupId(
        this DbSet<Group> groupSet,
        Ulid groupId,
        Ulid userId,
        CancellationToken token = default
    )
    {
        var groups = await groupSet
            .AsNoTracking()
            .AsSplitQuery()
            .Include(x => x.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .ThenInclude(m => m.Parent)
            .Where(g => g.Id == groupId)
            .Select(ch => new Group()
            {
               
                ChannelName = ch.Channel.Name,
                MyAccess = ch.Accesses.FirstOrDefault(a => a.UserId == userId),
                LastMessage = ch.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()
            }.Spread(ch, new string[]{nameof(Group.ChannelName), nameof(Group.LastMessage), nameof(Group.MyAccess)}))
            .ToListAsync(token);

        return groups.FirstOrDefault();
    }

    public static async Task<List<Group>> GetGroupWithJustMyAccessByChannelId(
        this DbSet<Group> groupSet,
        Ulid channelId,
        Ulid userId,
        int skip = 0,
        int take = 5,
        CancellationToken token = default
    )
    {
        return await groupSet
                
            .AsNoTracking()
            .AsSplitQuery()
            .Include(x => x.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .ThenInclude(m => m.Parent)
            .Where(g => g.ChannelId == channelId)
            .Skip(skip)
            .Take(take)
            .Select(ch => new Group()
            {
               
                ChannelName = ch.Channel.Name,
                MyAccess = ch.Accesses.FirstOrDefault(a => a.UserId == userId),
                LastMessage = ch.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()
            }.Spread(ch, new string[]{nameof(Group.ChannelName), nameof(Group.LastMessage), nameof(Group.MyAccess)}))
            .ToListAsync(token);
    }
}
