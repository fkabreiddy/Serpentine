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
            t.Property(o => o.Id)
                .HasConversion(
                    v => v.ToString(),
                    v => Ulid.Parse(v));
            t.HasMany(u => u.MyChannels).WithOne(mc => mc.User).HasForeignKey(mc => mc.UserId)
                .OnDelete(DeleteBehavior.Cascade);



        });

        modelBuilder.Entity<Channel>(t =>
        {
            t.HasIndex(u => u.Name).IsUnique();
            t.Ignore(u => u.MyMember);
            t.Ignore(u => u.MembersCount);
            
            t.HasMany(u => u.Members).WithOne(mc => mc.Channel).HasForeignKey(mc => mc.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);
            
           t.Property(o => o.Id)
                .HasConversion(
                    v => v.ToString(),
                    v => Ulid.Parse(v));
            
        });
        
        modelBuilder.Entity<ChannelMember>(t =>
        {
            t.HasIndex(u => new{u.ChannelId, u.UserId}).IsUnique();
            t.Navigation(cm => cm.User).AutoInclude().IsRequired();
            t.HasOne(cm => cm.Channel).WithMany(cm => cm.Members).HasForeignKey(c => c.ChannelId);
            t.HasOne(cm => cm.User).WithMany(cm => cm.MyChannels).HasForeignKey(c => c.UserId);
            t.Property(o => o.Id)
                .HasConversion(
                    v => v.ToString(),
                    v => Ulid.Parse(v));
            t.Property(o => o.UserId)
                .HasConversion(
                    v => v.ToString(),
                    v => Ulid.Parse(v));
            t.Property(o => o.ChannelId)
                .HasConversion(
                    v => v.ToString(),
                    v => Ulid.Parse(v));
            
            

        });



    }
}