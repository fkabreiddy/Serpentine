using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SerpentineApi.Migrations
{
    /// <inheritdoc />
    public partial class ChannelBan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChannelMembers_ChannelMemberRoles_RoleId",
                table: "ChannelMembers"
            );

            migrationBuilder.DropTable(name: "ChannelMemberRoles");

            migrationBuilder.DropIndex(name: "IX_ChannelMembers_RoleId", table: "ChannelMembers");

            migrationBuilder.DropColumn(name: "RoleId", table: "ChannelMembers");

            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "ChannelMembers",
                type: "bit",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.CreateTable(
                name: "ChannelBans",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ChannelId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Reason = table.Column<string>(
                        type: "nvarchar(300)",
                        maxLength: 300,
                        nullable: false
                    ),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelBans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChannelBans_Channels_ChannelId",
                        column: x => x.ChannelId,
                        principalTable: "Channels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_ChannelBans_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_ChannelBans_ChannelId_UserId",
                table: "ChannelBans",
                columns: new[] { "ChannelId", "UserId" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_ChannelBans_UserId",
                table: "ChannelBans",
                column: "UserId"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "ChannelBans");

            migrationBuilder.DropColumn(name: "IsAdmin", table: "ChannelMembers");

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
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
    }
}
