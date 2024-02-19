import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const jsonReq = await req.json();
    const user = await prisma.driveUser.findUnique({
        where: {
            email: jsonReq['email']
        }
    });

    if (!user) {
        var created = await prisma.driveUser.create({
            data: jsonReq
        });
        if (created) {
            return NextResponse.json({
                "message": "User Created Successfuly ",
                "data": created,

            }, { status: 201 });
        }
    }



    return NextResponse.json({
        "message": "User alredy found",

    }, { status: 401 });
}