namespace SerpentineApi.Features;

public interface ISender
{
    Task<TResponse> SendAndValidateAsync<TResponse>(
        IRequest<TResponse> command,
        CancellationToken cancellationToken = default
    );
}