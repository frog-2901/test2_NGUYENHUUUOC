/*
  Warnings:

  - You are about to drop the column `password` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "password",
ADD COLUMN     "address" TEXT;
