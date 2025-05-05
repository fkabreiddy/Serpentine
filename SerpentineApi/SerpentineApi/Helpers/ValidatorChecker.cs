using FluentValidation;
using FluentValidation.Results;
using SerpentineApi.Utilities;

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