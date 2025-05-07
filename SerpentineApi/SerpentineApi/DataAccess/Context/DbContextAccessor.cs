using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace SerpentineApi.DataAccess.Context;

public class DbContextAccessor<T>(SerpentineDbContext context)
    where T : BaseEntity
{
    public void StopTracking()
    {
        context.ChangeTracker.Clear();
    }
    
    public async Task<T> AddAsync(T entity, bool dontTrack = true, CancellationToken token = default)
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
    
    public async Task<T?> GetAnyAsync(
        Expression<Func<T, bool>> expression,
        List<Func<IQueryable<T>, IQueryable<T>>>? navigationProperties = null,
        bool trackChanges = false,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<T> query;
        if (trackChanges)
        {
            query = context.Set<T>().AsTracking().AsSplitQuery().AsQueryable();

        }
        else
        {
            query = context.Set<T>().AsSplitQuery().AsNoTracking().AsQueryable();

        }
        
        if (navigationProperties is not null)
        {
            query = navigationProperties.Aggregate(
                query,
                (current, include) => include(current)
            );
        }
        
        if(trackChanges)
            StopTracking();
        
        var result = await query.FirstOrDefaultAsync(expression, cancellationToken);

        return result;
    }
    
    public async Task<T?> UpdateWithExpressionAsync(
        Expression<Func<T, bool>> expression,
        Expression<Func<SetPropertyCalls<T>, SetPropertyCalls<T>>> propsExpression,
        CancellationToken cancellationToken = default,
        bool stopTracking = false
    )
    {
        await context
            .Set<T>()
            .Where(expression)
            .ExecuteUpdateAsync(propsExpression, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        if (stopTracking)
            StopTracking();

        return await context.Set<T>().FirstOrDefaultAsync(expression);
    }




}