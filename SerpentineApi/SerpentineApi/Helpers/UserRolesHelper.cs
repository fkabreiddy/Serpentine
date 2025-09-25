namespace SerpentineApi.Helpers;

public static class UserRolesHelper
{
    public static UserRoles GetRole(User user)
    {
        switch (user.Role.AccessLevel)
        {
            case 0:
                return UserRoles.User;
            case 1:
                return UserRoles.Admin;
                
            case 2:
                return UserRoles.Tester;
            case 3:
                return UserRoles.Developer;
            default:
                return UserRoles.User;
        }
    }
}

public enum UserRoles
{
    User = 0,
    Admin = 1,
    Tester = 2,
    Developer = 3,
}
