import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: any }) {
    let userid: any = params.query[0];

    if (userid == null || !Number.parseInt(userid)) {
        return NextResponse.json({
            message: "No user Id found in url",
            userId: userid
        }, { status: 404 });
    }

    var userFiles = await prisma.file.findMany({
        where: {
            userId: Number.parseInt(userid),
            parentId: params.query[1] != null ? Number.parseInt(params.query[1]) : 0
        }
    })

    return NextResponse.json({
        message: "Success",
        parentof: params.query[1],
        files: userFiles,
    });
}