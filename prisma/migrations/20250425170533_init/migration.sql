-- CreateTable
CREATE TABLE "Domain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "homepage" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_address_key" ON "Domain"("address");
