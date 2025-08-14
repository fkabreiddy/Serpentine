using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SerpentineApi.Features;

public interface IRequest<TResponse> { }

public abstract class RequestWithUserCredentials
{
    [JsonIgnore, BindNever]
        public Ulid CurrentUserId { get; private set; } 

    public void SetCurrentUserId(Ulid userId)
    {
        CurrentUserId = userId;
    }
}
