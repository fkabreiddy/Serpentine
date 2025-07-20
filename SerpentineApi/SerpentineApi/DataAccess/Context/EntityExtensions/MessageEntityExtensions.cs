using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.DataAccess.Context.EntityExtensions;

public static class MessageEntityExtensions
{
    public static async Task<int> CountUnreadMessagesFromAGroup(
        this DbSet<Message> messageSet,
        Ulid groupId,
        Ulid currentUserId,
        DateTime date,
        CancellationToken token = default
    )
    {
        return await messageSet.CountAsync(
            x => x.GroupId == groupId && x.CreatedAt <= date && x.SenderId != currentUserId,
            token
        );
    }
}
