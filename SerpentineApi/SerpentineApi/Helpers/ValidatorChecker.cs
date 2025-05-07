using ValidationException = FluentValidation.ValidationException;
using ValidationResult = FluentValidation.Results.ValidationResult;

namespace SerpentineApi.Helpers;

public static class ValidatorChecker
{
    public static bool CheckValidation(ValidationResult? validationResult)
    {
        if (validationResult is not null && !validationResult.IsValid)
        {
            throw new ValidationException("Validation failed", validationResult.Errors);
        }

        return true;

    }
}