-- Non-destructive additions needed by the current application schema. Existing
-- deployments may already have these objects if they were created via db push.
-- Review the deployment's migration baseline and back it up before applying.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "sessionVersion" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cargoWeight" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cargoValue" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cargoDescription" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "pickupAddress" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "dropAddress" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "serviceType" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "specialInstructions" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'Site',
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Anonymous',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
