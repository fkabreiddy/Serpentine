using System.Security.Cryptography;
using System.Text;

namespace SerpentineApi.Utilities;


public static class Hasher
{
    public static string Hash(this string password)
    {
        using SHA256 sha256Hash = SHA256.Create();

        byte[] data = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

        return BitConverter.ToString(data).Replace("-", string.Empty).ToLower();
    }
}

