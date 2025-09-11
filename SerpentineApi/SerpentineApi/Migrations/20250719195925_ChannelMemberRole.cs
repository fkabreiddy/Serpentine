using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SerpentineApi.Migrations
{
    /// <inheritdoc />
    public partial class ChannelMemberRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Public",
                table: "Groups",
                type: "bit",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AddColumn<string>(
                name: "Rules",
                table: "Groups",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "RoleId",
                table: "ChannelMembers",
                type: "nvarchar(450)",
                nullable: true
            );

            migrationBuilder.CreateTable(
                name: "ChannelMemberRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelMemberRoles", x => x.Id);
                }
            );

            migrationBuilder.InsertData(
                table: "ChannelMemberRoles",
                columns: new[] { "Id", "CreatedAt", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    {
                        "01K0J4A5K31FJVPKZY094JTFNB",
                        new DateTime(2025, 7, 19, 15, 59, 24, 261, DateTimeKind.Local).AddTicks(
                            9509
                        ),
                        "admin",
                        new DateTime(2025, 7, 19, 15, 59, 24, 264, DateTimeKind.Local).AddTicks(
                            5376
                        ),
                    },
                    {
                        "01K0J4A5K8Y9ZF2AVDHBPYATHD",
                        new DateTime(2025, 7, 19, 15, 59, 24, 264, DateTimeKind.Local).AddTicks(
                            6760
                        ),
                        "default",
                        new DateTime(2025, 7, 19, 15, 59, 24, 264, DateTimeKind.Local).AddTicks(
                            6765
                        ),
                    },
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMembers_RoleId",
                table: "ChannelMembers",
                column: "RoleId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_ChannelMembers_ChannelMemberRoles_RoleId",
                table: "ChannelMembers",
                column: "RoleId",
                principalTable: "ChannelMemberRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChannelMembers_ChannelMemberRoles_RoleId",
                table: "ChannelMembers"
            );

            migrationBuilder.DropTable(name: "ChannelMemberRoles");

            migrationBuilder.DropIndex(name: "IX_ChannelMembers_RoleId", table: "ChannelMembers");

            migrationBuilder.DropColumn(name: "Public", table: "Groups");

            migrationBuilder.DropColumn(name: "Rules", table: "Groups");

            migrationBuilder.DropColumn(name: "RoleId", table: "ChannelMembers");
        }
    }
}
