namespace SerpentineApi.Exceptions;

public class ValidationException(List<string> errors) : System.Exception("Validation failed.")
{
    public List<string> Errors { get; } = errors;

    public override string ToString()
    {
        return $"ValidationException: {string.Join("; ", Errors)}";
    }
}
