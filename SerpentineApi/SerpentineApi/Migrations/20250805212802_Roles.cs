using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SerpentineApi.Migrations
{
    /// <inheritdoc />
    public partial class Roles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RoleId",
                table: "Users",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AccessLevel = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "AccessLevel", "CreatedAt", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { "01K1Y24KEJ2SQ283X365D8QBJP", 0, new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(3914), "User", new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(3919) },
                    { "01K1Y24KEP473CNR8N01ZCXRV9", 3, new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5405), "Developer", new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5406) },
                    { "01K1Y24KEPDA7ZFCX6YCP3MY7M", 1, new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5394), "Admin", new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5395) },
                    { "01K1Y24KEPTCVKR97AKSWKHTP8", 2, new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5401), "Tester", new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5402) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Users_RoleId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "Users");
        }
    }
}
