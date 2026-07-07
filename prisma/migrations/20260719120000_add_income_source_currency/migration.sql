-- Add per-source currency (VND | USD) to income sources.
-- baseSalary/hourlyRate are denominated in this currency; income entries still
-- store amounts in their target wallet's currency (converted at the user's rate
-- when the source currency differs from the wallet).
ALTER TABLE "finance_income_sources" ADD COLUMN "currency" VARCHAR(8) NOT NULL DEFAULT 'VND';
