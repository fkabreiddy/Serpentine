using System.Collections.Concurrent;

namespace SerpentineApi.DataAccess.Cache;


public class ActiveUsersCache
{
    private static readonly ConcurrentDictionary<string, string> ActiveUsers = new();
    
    public bool AddUser(string userId, string connectionId)
    {
        return ActiveUsers.TryAdd(userId, connectionId);
    }

    public bool RemoveUser(string userId)
    {
        return ActiveUsers.TryRemove(userId, out _);
    }

    public bool GetActivity(string userId)
    {
        return ActiveUsers.TryGetValue(userId, out _);
        
    }
    
    
    
    

}