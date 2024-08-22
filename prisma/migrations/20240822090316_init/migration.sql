-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "category" "Category",

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
