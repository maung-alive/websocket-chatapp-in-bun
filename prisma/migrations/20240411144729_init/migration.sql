/*
  Warnings:

  - The primary key for the `ChatRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT
);
INSERT INTO "new_ChatRoom" ("id", "name") SELECT "id", "name" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
