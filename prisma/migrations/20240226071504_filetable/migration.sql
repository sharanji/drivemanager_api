-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
