import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
    const jsonBody = await req.json();

    const user = await prisma.driveUser.findFirst({
        where: {
            mobile: jsonBody['mobile']
        }
    });

    if (user && user.password == jsonBody['password']) {
        return NextResponse.json({
            message: "User Login Successfull",
            data: user
        });
    }

    return NextResponse.json({
        message: "Invalid Credentials",
    }, { status: 401 });

}