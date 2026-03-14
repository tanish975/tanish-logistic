/*
  Warnings:

  - Added the required column `dropAddress` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddress` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cargoDescription" TEXT,
ADD COLUMN     "cargoValue" DOUBLE PRECISION,
ADD COLUMN     "cargoWeight" DOUBLE PRECISION,
ADD COLUMN     "dropAddress" TEXT NOT NULL,
ADD COLUMN     "pickupAddress" TEXT NOT NULL,
ADD COLUMN     "serviceType" TEXT NOT NULL,
ADD COLUMN     "specialInstructions" TEXT;
