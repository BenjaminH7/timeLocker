-- CreateTable
CREATE TABLE "timeLimit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unlockDate" DATETIME NOT NULL,
    "icloudEmail" TEXT NOT NULL,
    "icloudPassword" TEXT NOT NULL,
    "generatedCode" INTEGER NOT NULL
);
