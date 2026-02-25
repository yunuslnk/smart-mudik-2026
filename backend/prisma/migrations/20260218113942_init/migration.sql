-- CreateEnum
CREATE TYPE "Status" AS ENUM ('BERANGKAT', 'SAMPAI');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MudikEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jam" TEXT NOT NULL,
    "provinsiAsal" TEXT NOT NULL,
    "kotaAsal" TEXT NOT NULL,
    "provinsiTujuan" TEXT NOT NULL,
    "kotaTujuan" TEXT NOT NULL,
    "kendaraan" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'BERANGKAT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MudikEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MudikEntry_userId_key" ON "MudikEntry"("userId");

-- CreateIndex
CREATE INDEX "MudikEntry_kotaTujuan_idx" ON "MudikEntry"("kotaTujuan");

-- CreateIndex
CREATE INDEX "MudikEntry_provinsiTujuan_idx" ON "MudikEntry"("provinsiTujuan");

-- CreateIndex
CREATE INDEX "MudikEntry_status_idx" ON "MudikEntry"("status");

-- AddForeignKey
ALTER TABLE "MudikEntry" ADD CONSTRAINT "MudikEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
