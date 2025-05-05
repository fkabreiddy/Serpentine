using FluentValidation;
using SerpentineApi.Helpers;

namespace SerpentineApi.Features;

public class Sender (IServiceProvider serviceProvider) : ISender
{
    

    public async Task<TResponse> SendAndValidateAsync<TResponse>(
        IRequest<TResponse> command,
        CancellationToken cancellationToken = default
    )
    {
        var commandType = command.GetType();
        var validatorType = typeof(IValidator<>).MakeGenericType(commandType);
        var validator = serviceProvider.GetService(validatorType);
        if (validator is not null)
        {
            var result = await ((dynamic)validator).ValidateAsync(
                (dynamic)command,
                cancellationToken
            );
            ValidatorChecker.CheckValidation(result);
        }
        var handlerType = typeof(IEndpointHandler<,>).MakeGenericType(
            command.GetType(),
            typeof(TResponse)
        );
        dynamic handler = serviceProvider.GetRequiredService(handlerType);

        return await handler.HandleAsync((dynamic)command, cancellationToken);
    }
}
