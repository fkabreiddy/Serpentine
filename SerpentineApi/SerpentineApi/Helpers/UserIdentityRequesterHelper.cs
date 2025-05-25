using System.IdentityModel.Tokens.Jwt;

namespace SerpentineApi.Helpers;

using System.Security.Claims;

public static class UserIdentityRequesterHelper
{
    /// <summary>
    /// Gets the User Id from the current http request
    /// </summary>
    /// <param name="user">Claims principal from the current HttpContext</param>
    /// <returns>The user Id from the HttpContext</returns>
    public static int? GetUserIdFromClaims(ClaimsPrincipal user)
    {
        var subClaim = user.FindFirst(JwtRegisteredClaimNames.Sub);
        if (subClaim == null)
        {
            // También puede ser ClaimTypes.NameIdentifier en algunos casos
            subClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        }

        if (subClaim != null && int.TryParse(subClaim.Value, out int userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException();
    }
}
