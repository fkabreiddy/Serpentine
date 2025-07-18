using System.Reflection;

namespace SerpentineApi.Helpers;

public static class SpreadExtensionHelper
{
    
        public static TTarget Spread<TSource, TTarget>(this TTarget target, TSource source, string[]? ignoreProps = null)
        {
            if (target == null || source == null)
                return target;

            foreach (PropertyInfo sourceProp in typeof(TSource).GetProperties())
            {
                if (ignoreProps is not null && ignoreProps.Contains(sourceProp.Name))
                    continue;
                
                PropertyInfo targetProp = typeof(TTarget).GetProperty(sourceProp.Name);

                if (targetProp == null || !targetProp.CanWrite)
                    continue;

                var value = sourceProp.GetValue(source);
                targetProp.SetValue(target, value ?? GetDefault(targetProp.PropertyType));
            }
            return target;
        }

        private static object? GetDefault(Type type)
        {
            return type.IsValueType ? Activator.CreateInstance(type) : null;
        }
    

}