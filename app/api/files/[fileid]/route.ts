import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { fileid: any } }) {
    let fileid: any = params.fileid;

    const fetch_file = await prisma.file.findFirst({
        where: {
            id: Number.parseInt(fileid),
        }
    });

    if (fetch_file) {

        return NextResponse.json({
            message: "Success",
            file: fetch_file,
            fileUrl: "/uploads/files/" + fetch_file?.fileName,
        });
    }

    return NextResponse.json({
        message: "File not found",
    }, { status: 404 });

}