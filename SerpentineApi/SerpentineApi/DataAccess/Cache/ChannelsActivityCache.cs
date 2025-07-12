using System.Collections.Concurrent;

namespace SerpentineApi.DataAccess.Cache;


public class ChannelsActivityCache
{
    private static readonly ConcurrentDictionary<string, HashSet<string>> ActiveChannels = new();
    private static readonly ConcurrentDictionary<string, HashSet<string>> ActiveUsers = new();

    public bool AddChannel(string channelId, string userId)
    {
        var userSet = ActiveChannels.GetOrAdd(channelId, _ => new HashSet<string>());
        var channelSet = ActiveUsers.GetOrAdd(userId, _ => new HashSet<string>());

        lock (userSet)
        {
            if(!userSet.Add(userId))
            {
                return false; 
            }
        }

        lock (channelSet)
        {
            if(!channelSet.Add(channelId))
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

        if (ActiveChannels.TryGetValue(userId, out var usersSet))
        {
            lock (usersSet)
            {
                var removed = usersSet.RemoveWhere(x => x == userId);

                if (usersSet.Count == 0)
                {
                    ActiveChannels.TryRemove(channelId, out _);
                }

                if (removed <= 0)
                    return false;
            }
        }
        
        
        if (ActiveUsers.TryGetValue(userId, out var channelsSet))
        {
            lock (channelsSet)
            {

                if (!channelsSet.Remove(channelId))
                {
                    return false;
                }
                
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
                    channelsSet.Remove(userId);

                }
            }
            
            
        }
        
        return ActiveUsers.TryRemove(userId, out _);
        
    }

}