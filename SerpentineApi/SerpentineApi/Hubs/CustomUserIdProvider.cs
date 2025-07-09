using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace SerpentineApi.Hubs;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        var user = connection.User;
        var subClaim = user.FindFirst(JwtRegisteredClaimNames.Sub)
                       ?? user.FindFirst(ClaimTypes.NameIdentifier);

        if (subClaim != null && Ulid.TryParse(subClaim.Value, out var uid))
        {
            return uid.ToString();  
        }

       
        throw new UnauthorizedAccessException();
    }
}