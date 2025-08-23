namespace SerpentineApi.Helpers
{
    public class UlidHelper
    {
        public static bool IsValid(Ulid ulid)
        {
            if (string.IsNullOrEmpty(ulid.ToString()) || string.IsNullOrWhiteSpace(ulid.ToString()))
            {
                return false;
            }

            if (ulid == Ulid.Empty)
            {
                return false;
            }

            if (!Ulid.TryParse(ulid.ToString(), out Ulid parsedUlid))
            {
                return false;
            }

            return true;
        }
        
         public static bool IsValid(Ulid? ulid)
        {
            if (ulid == null)
            {
                return false;
            }

            if (string.IsNullOrEmpty(ulid.ToString()) || string.IsNullOrWhiteSpace(ulid.ToString()))
            {
                return false;
            }

            if (ulid == Ulid.Empty)
            {
                return false;
            }

            if (!Ulid.TryParse(ulid.ToString(), out Ulid parsedUlid))
                {
                    return false;
                }

            return true;
        }
    }
}
