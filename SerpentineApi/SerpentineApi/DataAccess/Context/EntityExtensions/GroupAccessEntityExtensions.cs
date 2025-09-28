using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.DataAccess.Context.EntityExtensions
{
    public static class GroupAccessEntityExtensions
    {
        public static async Task<int> GetMessagesCountByChannelId(
            this DbSet<GroupAccess> groupAccessSet,
            Ulid channelId,
            Ulid userId,
            CancellationToken token = default
        )
        {
            var grouping = await groupAccessSet
                .Where(g => g.Group.ChannelId == channelId && g.UserId == userId)
                .GroupBy(g => g.GroupId)
                .Select(g => new
                {
                    GroupId = g.Key,
                    MessagesCount = g.Sum(la =>
                        la.Group.Messages.Count(m =>
                            m.CreatedAt > la.LastReadMessageDate && m.SenderId != userId
                        )
                    ),
                })
                .ToListAsync(token);

            return grouping.Sum(g => g.MessagesCount);
        }
    }
}
