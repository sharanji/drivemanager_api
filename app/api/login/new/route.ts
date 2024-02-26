import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
    const jsonBody = await req.json();
    try {
        const user = await prisma.driveUser.create({
            data: jsonBody
        });

        if (user) {
            return NextResponse.json({
                message: "User created succssfully",
                data: user
            });
        }
        else {
            return NextResponse.json({
                message: "Something went wrong",
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            message: error,
        }, { status: 401 });
    }


}