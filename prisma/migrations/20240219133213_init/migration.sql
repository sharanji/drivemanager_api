-- CreateTable
CREATE TABLE "DriveUser" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,

    CONSTRAINT "DriveUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriveUser_email_key" ON "DriveUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DriveUser_mobile_key" ON "DriveUser"("mobile");
