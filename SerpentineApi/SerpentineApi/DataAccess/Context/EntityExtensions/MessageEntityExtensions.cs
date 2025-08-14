using Microsoft.EntityFrameworkCore;
using SerpentineApi.Helpers;

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
    
    public static async Task<Message?> GetMessageById(
        this DbSet<Message> messageSet,
        Ulid messageId,
        CancellationToken token = default
    )
    {

        var messages = await messageSet.Where(m => m.Id == messageId).Select(m => new Message()
        {

            SenderName = m.Sender != null ? m.Sender.FullName : "",
            SenderUsername = m.Sender != null ? m.Sender.Username : "",
            SenderProfilePictureUrl = m.Sender != null ? m.Sender.ProfilePictureUrl : "",
            ParentContent = m.Parent != null ? m.Parent.Content.Substring(1, 50) : "",
            ChannelId = m.Group.ChannelId,
            ChannelName = m.Group.Channel.Name,
            GroupName = m.Group.Name
            


        }.Spread(m,new[]
        {
            nameof(Message.SenderName),
            nameof(Message.SenderProfilePictureUrl),
            nameof(Message.ParentContent),
            nameof(Message.SenderUsername),
            nameof(Message.ChannelId),
            nameof(Message.GroupName),
            nameof(Message.ChannelName),
        })).ToListAsync(token);

        return messages.FirstOrDefault();

    }
}
