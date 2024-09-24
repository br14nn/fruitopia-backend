-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,
    "productID" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
