using Microsoft.EntityFrameworkCore;

namespace SerpentineApi.DataAccess.Context;

public class SerpentineDbContext(DbContextOptions<SerpentineDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<ChannelMember> ChannelMembers { get; set; }

    public DbSet<Group> Groups { get; set; }

    public DbSet<GroupAccess> GroupAccesses { get; set; }

    public DbSet<Message> Messages { get; set; }
    
    
    public DbSet<ChannelBan> ChannelBans { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(t =>
        {
            t.HasMany(u => u.MyAccesses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            t.HasMany(u => u.Bans)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            
            t.HasIndex(u => u.Username).IsUnique();

            t.Property(o => o.Id).HasConversion(v => v.ToString(), v => Ulid.Parse(v));

            t.HasMany(u => u.MyChannels)
                .WithOne(mc => mc.User)
                .HasForeignKey(mc => mc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            t.HasMany(u => u.MyMessages)
                .WithOne(m => m.Sender)
                .HasForeignKey(m => m.SenderId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Channel>(t =>
        {
            t.HasIndex(u => u.Name).IsUnique();
            t.Ignore(u => u.MyMember);

            t.HasMany(u => u.Members)
                .WithOne(mc => mc.Channel)
                .HasForeignKey(mc => mc.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);
            
            t.HasMany(u => u.Bans)
                .WithOne(mc => mc.Channel)
                .HasForeignKey(mc => mc.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);

            t.Property(o => o.Id).HasConversion(v => v.ToString(), v => Ulid.Parse(v));

            t.HasMany(ch => ch.Groups)
                .WithOne(g => g.Channel)
                .HasForeignKey(g => g.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);
            
           
        });
        
        modelBuilder.Entity<ChannelBan>(t =>
        {

            t.HasOne(cb => cb.Channel)
                .WithMany(c => c.Bans)
                .HasForeignKey(mc => mc.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);

            t.Property(o => o.Id).HasConversion(v => v.ToString(), v => Ulid.Parse(v));

            t.HasOne(cb => cb.User)
                .WithMany(u => u.Bans)
                .HasForeignKey(cb => cb.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            t.HasIndex(u => new { u.ChannelId, u.UserId }).IsUnique();

        });
        
        

        modelBuilder.Entity<ChannelMember>(t =>
        {
            t.HasIndex(u => new { u.ChannelId, u.UserId }).IsUnique();
            t.Navigation(cm => cm.User).AutoInclude().IsRequired();
            
            t.HasOne(cm => cm.Channel).WithMany(cm => cm.Members).HasForeignKey(c => c.ChannelId);
            t.HasOne(cm => cm.User).WithMany(cm => cm.MyChannels).HasForeignKey(c => c.UserId);
            t.Property(o => o.Id).HasConversion(v => v.ToString(), v => Ulid.Parse(v));
            t.Property(o => o.UserId).HasConversion(v => v.ToString(), v => Ulid.Parse(v));
            t.Property(o => o.ChannelId).HasConversion(v => v.ToString(), v => Ulid.Parse(v));
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasOne(t => t.Sender).WithMany(u => u.MyMessages).IsRequired(false);
            entity
                .HasOne(m => m.Parent)
                .WithMany(m => m.Replies)
                .HasForeignKey(m => m.ParentId)
                .OnDelete(DeleteBehavior.SetNull);
            entity.Navigation(m => m.Sender).AutoInclude();
            entity.Property(o => o.Id).HasConversion(v => v.ToString(), v => Ulid.Parse(v));

            entity.HasMany(m => m.Replies).WithOne(m => m.Parent).OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(ga => ga.Group).WithMany(g => g.Messages).HasForeignKey(a => a.GroupId);
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.Navigation(cm => cm.Channel).AutoInclude().IsRequired();
            entity.Property(o => o.Id).HasConversion(v => v.ToString(), v => Ulid.Parse(v));

            entity.HasIndex(u => new { u.ChannelId, u.Name }).IsUnique();
            entity.HasOne(g => g.Channel).WithMany(ch => ch.Groups).HasForeignKey(g => g.ChannelId);
            entity
                .HasMany(ch => ch.Accesses)
                .WithOne(a => a.Group)
                .HasForeignKey(a => a.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
            entity
                .HasMany(ch => ch.Messages)
                .WithOne(a => a.Group)
                .HasForeignKey(a => a.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GroupAccess>(entity =>
        {
            entity.Property(o => o.Id).HasConversion(v => v.ToString(), v => Ulid.Parse(v));

            entity.HasIndex(u => new { u.GroupId, u.UserId }).IsUnique();
            entity.HasOne(ga => ga.Group).WithMany(g => g.Accesses).HasForeignKey(a => a.GroupId);
            entity.HasOne(ga => ga.User).WithMany(u => u.MyAccesses).HasForeignKey(a => a.UserId);
        });
        
      
    }
}
