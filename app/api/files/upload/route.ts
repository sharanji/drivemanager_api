import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from 'fs';
import path from 'path';
import { File } from "@prisma/client";



const saveBase64Image = (base64String: string, imageName: string) => {

    // Create a buffer from the base64 string
    const buffer = Buffer.from(base64String, 'base64');

    // Define the file path where the image will be saved
    const filePath = path.join(process.cwd(), 'public/uploads/files', imageName);

    try {
        // Write the buffer to the file
        fs.writeFileSync(filePath, buffer);
        console.log(`Image ${imageName} saved successfully.`);
    } catch (error) {
        console.error(`Error saving image ${imageName}:`, error);
    }
};

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const jsonReq = await req.json();
        jsonReq['lastUpdated'] = new Date();
        const fileBytes = jsonReq['fileBytes'];
        delete jsonReq['fileBytes'];


        const createdFile: File = await prisma.file.create({ data: jsonReq });
        saveBase64Image(fileBytes, createdFile.fileId! + "." + createdFile.mimeType)

        if (!createdFile) {
            return NextResponse.json({
                message: "Failed to create a file",
            });
        }

        return NextResponse.json({
            message: "Success",
            file: createdFile
        });

    } catch (error) {
        return NextResponse.json({
            message: "Failed " + error,

        }, { status: 500 });
    }

}