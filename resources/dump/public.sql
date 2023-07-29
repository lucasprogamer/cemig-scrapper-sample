/*
 Navicat Premium Data Transfer

 Source Server         : local-pg
 Source Server Type    : PostgreSQL
 Source Server Version : 150003 (150003)
 Source Host           : localhost:5432
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150003 (150003)
 File Encoding         : 65001

 Date: 28/07/2023 17:33:32
*/


-- ----------------------------
-- Type structure for InvoiceItemUnity
-- ----------------------------
DROP TYPE IF EXISTS "public"."InvoiceItemUnity";
CREATE TYPE "public"."InvoiceItemUnity" AS ENUM (
  'kWh',
  'Wh'
);
ALTER TYPE "public"."InvoiceItemUnity" OWNER TO "postgres";

-- ----------------------------
-- Table structure for clients
-- ----------------------------
DROP TABLE IF EXISTS "public"."clients";
CREATE TABLE "public"."clients" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "client_number" int4 NOT NULL,
  "instalation_number" int4 NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL
)
;
ALTER TABLE "public"."clients" OWNER TO "postgres";

-- ----------------------------
-- Table structure for invoice_items
-- ----------------------------
DROP TABLE IF EXISTS "public"."invoice_items";
CREATE TABLE "public"."invoice_items" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "total_price" int4 NOT NULL,
  "unity" "public"."InvoiceItemUnity" NOT NULL DEFAULT 'kWh'::"InvoiceItemUnity",
  "unit_price" money NOT NULL,
  "quantity" int4 NOT NULL,
  "invoice_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL
)
;
ALTER TABLE "public"."invoice_items" OWNER TO "postgres";

-- ----------------------------
-- Table structure for invoices
-- ----------------------------
DROP TABLE IF EXISTS "public"."invoices";
CREATE TABLE "public"."invoices" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "month_date" timestamp(3) NOT NULL,
  "expiration_date" timestamp(3) NOT NULL,
  "total" int4 NOT NULL,
  "barcode" text COLLATE "pg_catalog"."default",
  "client_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL
)
;
ALTER TABLE "public"."invoices" OWNER TO "postgres";

-- ----------------------------
-- Primary Key structure for table clients
-- ----------------------------
ALTER TABLE "public"."clients" ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table invoice_items
-- ----------------------------
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table invoices
-- ----------------------------
ALTER TABLE "public"."invoices" ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table invoice_items
-- ----------------------------
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "InvoiceItem_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table invoices
-- ----------------------------
ALTER TABLE "public"."invoices" ADD CONSTRAINT "Invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
