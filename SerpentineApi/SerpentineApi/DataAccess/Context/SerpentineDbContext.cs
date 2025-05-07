using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.DataAccess.Context;

public class SerpentineDbContext(DbContextOptions<SerpentineDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(t =>
        {
            t.HasIndex(u => u.Username).IsUnique();
            

        });

    }
}