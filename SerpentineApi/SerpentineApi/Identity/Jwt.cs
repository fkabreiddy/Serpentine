namespace SerpentineApi.Identity;

public class Jwt
{
    public required string Token { get; set; }
    public DateTime Expiration { get; set; }
    public required string Issuer { get; set; }
}