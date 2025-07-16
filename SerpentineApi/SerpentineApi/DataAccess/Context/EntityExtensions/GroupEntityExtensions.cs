using Microsoft.EntityFrameworkCore;

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
            .Include(x => x.Accesses.Where(a => a.UserId == userId))
            .Include(x => x.Messages)
            .Where(g => g.Id == groupId)
            .Select(ch => new Group()
            {
                Id = ch.Id,
                Name = ch.Name,
                ChannelId = ch.ChannelId,
                ChannelName = ch.Channel.Name,
                MessagesCount = ch.Messages.Count(),
                MyAccess = ch.Accesses.FirstOrDefault(a => a.UserId == userId),
            })
            .ToListAsync(token);

        return groups.FirstOrDefault();
    }

    public static async Task<List<Group>> GetGroupWithJustMyAccessByChannelId(
        this DbSet<Group> groupSet,
        Ulid channelId,
        Ulid userId,
        CancellationToken token = default
    )
    {
        return await groupSet
            .AsNoTracking()
            .AsSplitQuery()
            .Include(x => x.Accesses.Where(a => a.UserId == userId))
            .Include(x => x.Messages)
            .Where(g => g.ChannelId == channelId)
            .Select(ch => new Group()
            {
                Id = ch.Id,
                Name = ch.Name,
                ChannelId = ch.ChannelId,
                ChannelName = ch.Channel.Name,
                MessagesCount = ch.Messages.Count(),
                MyAccess = ch.Accesses.FirstOrDefault(a => a.UserId == userId),
            })
            .ToListAsync(token);
    }
}
