using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SerpentineApi.Migrations
{
    /// <inheritdoc />
    public partial class AlbumCovers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MembersCount",
                table: "Channels");

            migrationBuilder.AddColumn<string>(
                name: "ChannelBanner",
                table: "Channels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ChannelCover",
                table: "Channels",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChannelBanner",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "ChannelCover",
                table: "Channels");

            migrationBuilder.AddColumn<int>(
                name: "MembersCount",
                table: "Channels",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
