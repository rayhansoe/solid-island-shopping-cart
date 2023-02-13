/*
  Warnings:

  - Added the required column `quantities` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "quantities" INTEGER NOT NULL,
    "totalPrice" REAL NOT NULL
);
INSERT INTO "new_Transaction" ("createdAt", "id", "totalPrice", "updatedAt") SELECT "createdAt", "id", "totalPrice", "updatedAt" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
