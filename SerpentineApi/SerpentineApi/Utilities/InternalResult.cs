using System.Diagnostics.CodeAnalysis;

namespace SerpentineApi.Utilities;

public class InternalResult<T>(
    bool success,
    T? data = default,
    string message = "Success",
    List<string>? errors = null
)
{
    public T? Data { get; } = data;
    public bool IsSuccess { get; set; } = success;
    public string Message => message;
    public List<string> Errors => errors ?? new List<string>();

    [MemberNotNullWhen(true, nameof(Data))]
    public bool TaskSucceded() => IsSuccess && Data != null;
}
