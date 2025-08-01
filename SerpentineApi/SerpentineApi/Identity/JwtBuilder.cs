using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace SerpentineApi.Identity;

public class JwtBuilder(IOptions<JwtSettings> jwtSettings)
{
    private JwtSettings _jwtSettings = jwtSettings.Value;

    public Jwt? GenerateToken(UserResponse user)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _jwtSettings.Key ?? throw new NullReferenceException(nameof(_jwtSettings.Key))
            )
        );

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new(
                [
                    new Claim(JwtRegisteredClaimNames.Nickname, user.Username),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Picture, user.ProfilePictureUrl),
                    new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                    new Claim("age", user.Age.ToString()),
                    new Claim(JwtRegisteredClaimNames.Birthdate, user.DayOfBirth.ToString()),
                    new Claim("createdAt", user.CreatedAt.ToString())
                ]
            ),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = credentials,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
        };

        var handler = new JsonWebTokenHandler();

        var token = handler.CreateToken(tokenDescriptor);

        if (token is null)
        {
            return null;
        }

        return new()
        {
            Expiration = DateTime.Now.AddDays(7),
            Issuer = _jwtSettings.Issuer,
            Token = token,
        };
    }
}
