using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SerpentineApi.Migrations
{
    /// <inheritdoc />
    public partial class GroupsAndMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Group_Channels_ChannelId", table: "Group");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupAccess_Group_GroupId",
                table: "GroupAccess"
            );

            migrationBuilder.DropForeignKey(
                name: "FK_GroupAccess_Users_UserId",
                table: "GroupAccess"
            );

            migrationBuilder.DropForeignKey(name: "FK_Message_Group_GroupId", table: "Message");

            migrationBuilder.DropForeignKey(name: "FK_Message_Message_ParentId", table: "Message");

            migrationBuilder.DropForeignKey(name: "FK_Message_Users_SenderId", table: "Message");

            migrationBuilder.DropPrimaryKey(name: "PK_Message", table: "Message");

            migrationBuilder.DropPrimaryKey(name: "PK_GroupAccess", table: "GroupAccess");

            migrationBuilder.DropPrimaryKey(name: "PK_Group", table: "Group");

            migrationBuilder.RenameTable(name: "Message", newName: "Messages");

            migrationBuilder.RenameTable(name: "GroupAccess", newName: "GroupAccesses");

            migrationBuilder.RenameTable(name: "Group", newName: "Groups");

            migrationBuilder.RenameIndex(
                name: "IX_Message_SenderId",
                table: "Messages",
                newName: "IX_Messages_SenderId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Message_ParentId",
                table: "Messages",
                newName: "IX_Messages_ParentId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Message_GroupId",
                table: "Messages",
                newName: "IX_Messages_GroupId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_GroupAccess_UserId",
                table: "GroupAccesses",
                newName: "IX_GroupAccesses_UserId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_GroupAccess_GroupId_UserId",
                table: "GroupAccesses",
                newName: "IX_GroupAccesses_GroupId_UserId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Group_ChannelId_Name",
                table: "Groups",
                newName: "IX_Groups_ChannelId_Name"
            );

            migrationBuilder.AddPrimaryKey(name: "PK_Messages", table: "Messages", column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupAccesses",
                table: "GroupAccesses",
                column: "Id"
            );

            migrationBuilder.AddPrimaryKey(name: "PK_Groups", table: "Groups", column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAccesses_Groups_GroupId",
                table: "GroupAccesses",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAccesses_Users_UserId",
                table: "GroupAccesses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Channels_ChannelId",
                table: "Groups",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Groups_GroupId",
                table: "Messages",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Messages_ParentId",
                table: "Messages",
                column: "ParentId",
                principalTable: "Messages",
                principalColumn: "Id"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupAccesses_Groups_GroupId",
                table: "GroupAccesses"
            );

            migrationBuilder.DropForeignKey(
                name: "FK_GroupAccesses_Users_UserId",
                table: "GroupAccesses"
            );

            migrationBuilder.DropForeignKey(name: "FK_Groups_Channels_ChannelId", table: "Groups");

            migrationBuilder.DropForeignKey(name: "FK_Messages_Groups_GroupId", table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Messages_ParentId",
                table: "Messages"
            );

            migrationBuilder.DropForeignKey(name: "FK_Messages_Users_SenderId", table: "Messages");

            migrationBuilder.DropPrimaryKey(name: "PK_Messages", table: "Messages");

            migrationBuilder.DropPrimaryKey(name: "PK_Groups", table: "Groups");

            migrationBuilder.DropPrimaryKey(name: "PK_GroupAccesses", table: "GroupAccesses");

            migrationBuilder.RenameTable(name: "Messages", newName: "Message");

            migrationBuilder.RenameTable(name: "Groups", newName: "Group");

            migrationBuilder.RenameTable(name: "GroupAccesses", newName: "GroupAccess");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_SenderId",
                table: "Message",
                newName: "IX_Message_SenderId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ParentId",
                table: "Message",
                newName: "IX_Message_ParentId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Messages_GroupId",
                table: "Message",
                newName: "IX_Message_GroupId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_Groups_ChannelId_Name",
                table: "Group",
                newName: "IX_Group_ChannelId_Name"
            );

            migrationBuilder.RenameIndex(
                name: "IX_GroupAccesses_UserId",
                table: "GroupAccess",
                newName: "IX_GroupAccess_UserId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_GroupAccesses_GroupId_UserId",
                table: "GroupAccess",
                newName: "IX_GroupAccess_GroupId_UserId"
            );

            migrationBuilder.AddPrimaryKey(name: "PK_Message", table: "Message", column: "Id");

            migrationBuilder.AddPrimaryKey(name: "PK_Group", table: "Group", column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupAccess",
                table: "GroupAccess",
                column: "Id"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Group_Channels_ChannelId",
                table: "Group",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAccess_Group_GroupId",
                table: "GroupAccess",
                column: "GroupId",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_GroupAccess_Users_UserId",
                table: "GroupAccess",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Group_GroupId",
                table: "Message",
                column: "GroupId",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Message_ParentId",
                table: "Message",
                column: "ParentId",
                principalTable: "Message",
                principalColumn: "Id"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Users_SenderId",
                table: "Message",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull
            );
        }
    }
}
