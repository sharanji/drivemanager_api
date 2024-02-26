import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { userid: any } }) {
    let userid: any = params.userid;

    if (userid == null || !Number.parseInt(userid)) {
        return NextResponse.json({
            message: "No user Id found in url",
            userId: userid
        }, { status: 404 });
    }

    var userFiles = await prisma.file.findMany({
        where: {
            userId: Number.parseInt(userid),
        }
    })

    return NextResponse.json({
        message: "Success",
        files: userFiles,
    });
}