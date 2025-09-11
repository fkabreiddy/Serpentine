using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SerpentineApi.Migrations
{
    /// <inheritdoc />
    public partial class GroupsRequiresOverage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Rules", table: "Groups");

            migrationBuilder.AddColumn<bool>(
                name: "RequiresOverage",
                table: "Groups",
                type: "bit",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEJ2SQ283X365D8QBJP",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 16, 19, 43, 41, 761, DateTimeKind.Utc).AddTicks(3160),
                    new DateTime(2025, 8, 16, 19, 43, 41, 761, DateTimeKind.Utc).AddTicks(3165),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEP473CNR8N01ZCXRV9",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 16, 19, 43, 41, 765, DateTimeKind.Utc).AddTicks(3966),
                    new DateTime(2025, 8, 16, 19, 43, 41, 765, DateTimeKind.Utc).AddTicks(3966),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEPDA7ZFCX6YCP3MY7M",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 16, 19, 43, 41, 765, DateTimeKind.Utc).AddTicks(3931),
                    new DateTime(2025, 8, 16, 19, 43, 41, 765, DateTimeKind.Utc).AddTicks(3933),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEPTCVKR97AKSWKHTP8",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 16, 19, 43, 41, 765, DateTimeKind.Utc).AddTicks(3955),
                    new DateTime(2025, 8, 16, 19, 43, 41, 765, DateTimeKind.Utc).AddTicks(3956),
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "RequiresOverage", table: "Groups");

            migrationBuilder.AddColumn<string>(
                name: "Rules",
                table: "Groups",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEJ2SQ283X365D8QBJP",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(3914),
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(3919),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEP473CNR8N01ZCXRV9",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5405),
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5406),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEPDA7ZFCX6YCP3MY7M",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5394),
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5395),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEPTCVKR97AKSWKHTP8",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5401),
                    new DateTime(2025, 8, 5, 21, 27, 59, 702, DateTimeKind.Utc).AddTicks(5402),
                }
            );
        }
    }
}
