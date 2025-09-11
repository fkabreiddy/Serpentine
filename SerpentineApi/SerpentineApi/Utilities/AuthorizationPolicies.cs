using System.ComponentModel;

namespace SerpentineApi.Utilities;

public enum AuthorizationPolicies
{
    [Description("AllowAllUsers")]
    AllowAllUsers,

    [Description("OnlyAdmins")]
    OnlyAdmins,

    [Description("OnlyTesters")]
    OnlyTesters,
}
