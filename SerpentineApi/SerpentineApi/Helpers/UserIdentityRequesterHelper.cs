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
    public static Ulid GetUserIdFromClaims(ClaimsPrincipal user)
    {
        var subClaim = user.FindFirst(JwtRegisteredClaimNames.Sub);
        if (subClaim == null)
        {
            // También puede ser ClaimTypes.NameIdentifier en algunos casos
            subClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        }

        if (subClaim != null && Ulid.TryParse(subClaim.Value, out Ulid uid))
        {
            return uid;
        }

        throw new UnauthorizedAccessException();
    }

    /// <summary>
    /// Gets the User age from the current http request
    /// </summary>
    /// <param name="user">Claims principal from the current HttpContext</param>
    /// <returns>The user age from the HttpContext</returns>
    public static int GetUserAgeFromClaims(ClaimsPrincipal user)
    {
        var subClaim = user.FindFirst(JwtRegisteredClaimNames.Birthdate);
        if (subClaim == null)
        {
            subClaim = user.FindFirst(ClaimTypes.DateOfBirth);
        }

        if (subClaim != null && DateTime.Parse(subClaim.Value) is var date)
        {
            return GetAge(date);
        }

        throw new UnauthorizedAccessException();
    }

    private static int GetAge(DateTime dateOfBirth)
    {
        DateTime hoy = DateTime.Now;
        int edad = hoy.Year - dateOfBirth.Year;

        // Si aún no ha cumplido años este año, se resta uno
        if (dateOfBirth.Date > hoy.AddYears(-edad))
        {
            edad--;
        }

        return edad;
    }
}
