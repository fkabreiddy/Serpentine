using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.DataAccess.Context.EntityExtensions;

public static class ChannelEntityExtensions
{
    public static async Task<List<Channel>> GetChannelsWithJustMyMembershipByUserId(
        this DbSet<Channel> channelsContext,
        Ulid userId,
        CancellationToken token = default,
        int skip = 0,
        int take = 1
    )
    {
        var channels = await channelsContext
            .Include(ch => ch.Members.Where(m => m.UserId == userId))
            .Include(ch => ch.Groups)
            .ThenInclude(g => g.Accesses.Where(a => a.UserId == userId))
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
                BannerPicture = ch.BannerPicture,
                CoverPicture = ch.CoverPicture,
                Members = ch.Members,
                MyMember =
                    ch.Members.FirstOrDefault(m => m.UserId == userId) ?? new ChannelMember(),
            })
            .ToListAsync(token);

        return channels;
    }

    public static async Task<Channel?> GetChannelsWithJustMyMembershipByChannelId(
        this DbSet<Channel> channelsContext,
        Ulid channelId,
        Ulid userId,
        CancellationToken token = default
    )
    {
        var channel = await channelsContext
            .Include(ch => ch.Members.Where(m => m.UserId == userId))
            .Include(ch => ch.Groups)
            .ThenInclude(g => g.Accesses.Where(a => a.UserId == userId))
            .AsNoTracking()
            .AsSplitQuery()
            .Where(ch => ch.Members.Any(m => m.UserId == userId) && ch.Id == channelId)
            .Select(ch => new Channel()
            {
                Name = ch.Name,
                Id = ch.Id,
                CreatedAt = ch.CreatedAt,
                UpdatedAt = ch.UpdatedAt,
                AdultContent = ch.AdultContent,
                Description = ch.Description,
                MembersCount = ch.Members.Count,
                BannerPicture = ch.BannerPicture,
                CoverPicture = ch.CoverPicture,
                Members = ch.Members,
                MyMember = ch.Members.FirstOrDefault(m => m.UserId == userId) ?? new(),
            })
            .FirstOrDefaultAsync(token);

        return channel;
    }

    public static async Task<List<Channel>> GetChannelsWithJustMyMembershipByNameOrId(
        this DbSet<Channel> channelsContext,
        Ulid? channelId,
        string? channelName,
        Ulid userId,
        CancellationToken token = default
    )
    {
        IQueryable<Channel> query = channelsContext
            .Include(ch => ch.Members.Where(m => m.UserId == userId))
            .AsNoTracking()
            .AsSplitQuery()
            .Where(ch => ch.Name != null);

        if (channelId.HasValue)
        {
            query = query.Where(ch => ch.Id == channelId.Value);
        }
        else if (!string.IsNullOrWhiteSpace(channelName))
        {
            query = query.Where(ch => ch.Name.ToLower().Contains(channelName.ToLower()));
        }

        var channels = await query
            .OrderBy(ch => ch.Id)
            .Skip(0)
            .Take(5)
            .Select(ch => new Channel()
            {
                Name = ch.Name,
                Id = ch.Id,
                CreatedAt = ch.CreatedAt,
                UpdatedAt = ch.UpdatedAt,
                AdultContent = ch.AdultContent,
                Description = ch.Description,
                MembersCount = ch.Members.Count,
                BannerPicture = ch.BannerPicture,
                CoverPicture = ch.CoverPicture,
                Members = ch.Members,
                MyMember = ch.Members.FirstOrDefault(m => m.UserId == userId) ?? new(),
            })
            .ToListAsync(token);

        return channels;
    }
}
