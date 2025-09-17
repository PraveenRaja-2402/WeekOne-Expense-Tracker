-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'temp123',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
