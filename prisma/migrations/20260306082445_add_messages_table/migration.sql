-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "from" UUID NOT NULL,
    "to" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_from_idx" ON "messages"("from");

-- CreateIndex
CREATE INDEX "messages_to_idx" ON "messages"("to");

-- CreateIndex
CREATE INDEX "messages_id_createdAt_idx" ON "messages"("id", "createdAt");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_from_fkey" FOREIGN KEY ("from") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_to_fkey" FOREIGN KEY ("to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
