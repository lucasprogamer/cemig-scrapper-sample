/*
  Warnings:

  - A unique constraint covering the columns `[client_number]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clients_client_number_key" ON "clients"("client_number");
