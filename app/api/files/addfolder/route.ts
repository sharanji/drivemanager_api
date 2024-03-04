import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {

    const jsonReq = await req.json();

    // check exsist
    let exsist = await prisma.file.findMany(
        {
            where: {
                fileName: jsonReq['name'],
                parentId: jsonReq['parent']
            }
        }
    )

    const createdFile = await prisma.file.create(
        {
            data: {
                fileName: jsonReq['name'],
                mimeType: 'folder',
                fileSize: '0',
                lastUpdated: new Date(),
                userId: jsonReq['userId'],
                parentId: jsonReq['parent']
            }
        }
    );
    return NextResponse.json(createdFile);
}