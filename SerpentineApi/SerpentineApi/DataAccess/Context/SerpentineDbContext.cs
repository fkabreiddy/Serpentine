using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.DataAccess.Context;

public class SerpentineDbContext(DbContextOptions<SerpentineDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<ChannelMember> ChannelMembers { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(t =>
        {
            t.HasIndex(u => u.Username).IsUnique();

            

        });

        modelBuilder.Entity<Channel>(t =>
        {
            t.HasIndex(u => u.Name).IsUnique();
            t.Ignore(u => u.MyMember);
            t.Ignore(u => u.MembersCount);
            
        });
        
        modelBuilder.Entity<ChannelMember>(t =>
        {
            t.HasIndex(u => new{u.ChannelId, u.UserId}).IsUnique();
            t.HasOne(cm => cm.Channel).WithMany(cm => cm.Members).HasForeignKey(c => c.ChannelId);
            t.HasOne(cm => cm.User).WithMany(cm => cm.MyChannels).HasForeignKey(c => c.UserId);


        });



    }
}