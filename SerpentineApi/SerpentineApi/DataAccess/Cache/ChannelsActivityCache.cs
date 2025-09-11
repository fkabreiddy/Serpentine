using System.Collections.Concurrent;

namespace SerpentineApi.DataAccess.Cache;

public class ChannelsActivityCache(ILogger<ChannelsActivityCache> logger)
{
    private static readonly ConcurrentDictionary<string, HashSet<string>> ActiveChannels = new();
    private static readonly ConcurrentDictionary<string, HashSet<string>> ActiveUsers = new();

    public bool AddChannel(string channelId, string userId)
    {
        var userSet = ActiveChannels.GetOrAdd(channelId, _ => new HashSet<string>());
        var channelSet = ActiveUsers.GetOrAdd(userId, _ => new HashSet<string>());

        lock (userSet)
        {
            if (!userSet.Add(userId))
            {
                return false;
            }
        }

        lock (channelSet)
        {
            if (!channelSet.Add(channelId))
            {
                lock (userSet)
                {
                    userSet.Remove(userId);
                }
                return false;
            }
        }

        return true;
    }

    public bool RemoveUser(string channelId, string userId)
    {
        if (ActiveChannels.TryGetValue(channelId, out var usersSet))
        {
            lock (usersSet)
            {
                var removed = usersSet.Remove(userId);

                if (usersSet.Count == 0)
                {
                    ActiveChannels.TryRemove(channelId, out _);
                }
                logger.LogInformation(
                    $"Removed user {userId} from channel {channelId}. Remaining users: {usersSet.Count}"
                );

                if (!removed)
                    return false;
            }
        }

        if (ActiveUsers.TryGetValue(userId, out var channelsSet))
        {
            lock (channelsSet)
            {
                channelsSet.Remove(channelId);
                logger.LogInformation(
                    $"Removed channel {channelId} from user {userId}. Remaining channels: {channelsSet.Count}"
                );
            }
        }

        return true;
    }

    public int GetUsersCountOnAChannel(string channelId)
    {
        if (ActiveChannels.TryGetValue(channelId, out var set))
        {
            lock (set)
            {
                return set.Count;
            }
        }

        return 0;
    }

    public bool LeaveAllChannels(string userId)
    {
        if (ActiveUsers.TryGetValue(userId, out var channelsSet))
        {
            lock (channelsSet)
            {
                foreach (var channel in channelsSet)
                {
                    if (ActiveChannels.TryGetValue(channel, out var usersSet))
                    {
                        var removed = usersSet.RemoveWhere(x => x == userId);

                        if (usersSet.Count == 0)
                        {
                            ActiveChannels.TryRemove(channel, out _);
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }

        return ActiveUsers.TryRemove(userId, out _);
    }
}
