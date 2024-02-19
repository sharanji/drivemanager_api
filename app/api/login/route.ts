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
        return NextResponse.json({
            "message": "Email ID not found",

        }, { status: 404 });
    }

    if (user.password == jsonReq['password']) {

        return NextResponse.json({
            "message": "Login successfull",
            "data": user,
        });
    }



    return NextResponse.json({
        "message": "Invalid Crendtials",

    }, { status: 401 });
}