import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {

    const jsonReq = await req.json();

    // check exsist
    let exsist = await prisma.file.findMany(
        {
            where: {
                fileName: jsonReq['name'],
                userId: Number.parseInt(jsonReq['userId']),
                parentId: Number.parseInt(jsonReq['parent'])
            }
        }
    )

    if (exsist.length > 0)
        return NextResponse.json({ message: "Folder Name alredy exist", files: exsist }, { status: 401 });


    const createdFile = await prisma.file.create(
        {
            data: {
                fileName: jsonReq['name'],
                mimeType: 'folder',
                fileSize: '0',
                lastUpdated: new Date(),
                userId: Number.parseInt(jsonReq['userId']),
                parentId: Number.parseInt(jsonReq['parent'])
            }
        }
    );
    return NextResponse.json(createdFile);
}