-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,
    "productID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
