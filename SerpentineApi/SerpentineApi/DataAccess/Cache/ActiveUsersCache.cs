using System.Collections.Concurrent;

namespace SerpentineApi.DataAccess.Cache;


public class ActiveUsersCache
{
    private static readonly ConcurrentDictionary<string, string> ActiveUsers = new();
    
    

}