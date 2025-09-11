using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SerpentineApi.Migrations
{
    /// <inheritdoc />
    public partial class UnreadMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastAccess",
                table: "GroupAccesses",
                newName: "LastReadMessageDate"
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEJ2SQ283X365D8QBJP",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 26, 20, 2, 55, 244, DateTimeKind.Utc).AddTicks(3965),
                    new DateTime(2025, 8, 26, 20, 2, 55, 244, DateTimeKind.Utc).AddTicks(3969),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEP473CNR8N01ZCXRV9",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 26, 20, 2, 55, 248, DateTimeKind.Utc).AddTicks(571),
                    new DateTime(2025, 8, 26, 20, 2, 55, 248, DateTimeKind.Utc).AddTicks(571),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEPDA7ZFCX6YCP3MY7M",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 26, 20, 2, 55, 248, DateTimeKind.Utc).AddTicks(535),
                    new DateTime(2025, 8, 26, 20, 2, 55, 248, DateTimeKind.Utc).AddTicks(535),
                }
            );

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01K1Y24KEPTCVKR97AKSWKHTP8",
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[]
                {
                    new DateTime(2025, 8, 26, 20, 2, 55, 248, DateTimeKind.Utc).AddTicks(561),
                    new DateTime(2025, 8, 26, 20, 2, 55, 248, DateTimeKind.Utc).AddTicks(561),
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastReadMessageDate",
                table: "GroupAccesses",
                newName: "LastAccess"
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
    }
}
