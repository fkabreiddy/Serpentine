using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SerpentineApi.DataAccess.Models;

namespace SerpentineApi.DataAccess.Context;

public class DbContextAccessor<T>(SerpentineDbContext context)
    where T : BaseEntity
{
    public void StopTracking()
    {
        context.ChangeTracker.Clear();
    }
    
    public async Task<T> AddAsync(T entity, bool dontTrack = false, CancellationToken token = default)
    {
       var result =  await context.Set<T>().AddAsync(entity,token);
       await context.SaveChangesAsync(token);

       if (dontTrack)
       {
           StopTracking();
       }

       return result.Entity;
    }

    public async Task<bool> ExistsAsync(
        Expression<Func<T, bool>> expression,
        List<Func<IQueryable<T>, IQueryable<T>>>? navigationProperties = null,
        CancellationToken cancellationToken = default
    )
    {
        var query = context.Set<T>().AsSplitQuery().AsQueryable();

        if (navigationProperties is not null)
        {
            query = navigationProperties.Aggregate(
                query,
                (current, include) => include(current)
            );
        }

        var result = await query.AnyAsync(expression, cancellationToken);

       
        StopTracking();
        

        return result;
    }


}